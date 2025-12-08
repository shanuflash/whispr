"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as Ably from "ably";
import { AblyProvider } from "ably/react";
import { ChatClient, LogLevel } from "@ably/chat";
import { ChatClientProvider } from "@ably/chat/react";
import { UsernameModal } from "@/components/chat/username-modal";
import { RoomContent } from "@/components/chat/room-content";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const [username, setUsername] = useState<string | null>(null);
  const [realtimeClient, setRealtimeClient] = useState<Ably.Realtime | null>(
    null,
  );
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);

  useEffect(() => {
    if (!username) return;

    const config: Ably.ClientOptions = {
      clientId: username,
      authCallback: async (tokenParams, callback) => {
        try {
          const response = await fetch(
            `/whispr/api?clientId=${encodeURIComponent(username)}`,
          );
          if (!response.ok) {
            throw new Error("Failed to get token");
          }
          const tokenRequest = await response.json();
          callback(null, tokenRequest);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Authentication failed";
          console.error("Authentication error:", error);
          callback(errorMessage, null);
        }
      },
    };

    const realtime = new Ably.Realtime(config);
    const chat = new ChatClient(realtime, {
      logLevel: LogLevel.Info,
    });

    setRealtimeClient(realtime);
    setChatClient(chat);

    return () => {
      chat.rooms.release(roomId).catch(console.error);
      realtime.close();
    };
  }, [username, roomId]);

  return (
    <div className="min-h-screen bg-whispr-bg-primary flex items-center justify-center p-0 md:p-6">
      <div className="w-full h-full flex items-center justify-center">
        {!username ? (
          <UsernameModal onSubmit={setUsername} />
        ) : !realtimeClient || !chatClient ? (
          <LoadingSpinner message="Connecting to room..." />
        ) : (
          <AblyProvider client={realtimeClient}>
            <ChatClientProvider client={chatClient}>
              <RoomContent roomId={roomId} username={username} />
            </ChatClientProvider>
          </AblyProvider>
        )}
      </div>
    </div>
  );
}
