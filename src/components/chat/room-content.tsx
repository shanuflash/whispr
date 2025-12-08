"use client";

import { useState } from "react";
import { ChatRoomProvider } from "@ably/chat/react";
import { ConnectionStatus } from "./connection-status";
import { RoomStatus } from "./room-status";
import { PresenceStatus } from "./presence-status";
import { ChatBox } from "./chat-box";

interface RoomContentProps {
  roomId: string;
  username: string;
}

export function RoomContent({ roomId, username }: RoomContentProps) {
  const [showPresence, setShowPresence] = useState(false);

  return (
    <ChatRoomProvider name={roomId}>
      <div className="flex flex-col w-full max-w-7xl h-screen md:h-[calc(100vh-3rem)] overflow-hidden mx-auto bg-whispr-bg-primary md:border border-whispr-border md:rounded-2xl shadow-2xl">
        <header className="flex flex-col md:flex-row w-full border-b border-whispr-border">
          <div className="flex-1 md:border-r border-whispr-border">
            <ConnectionStatus />
          </div>
          <div className="flex-1 border-t md:border-t-0 border-whispr-border">
            <RoomStatus
              roomId={roomId}
              onTogglePresence={() => setShowPresence(!showPresence)}
            />
          </div>
        </header>

        <div className="flex flex-1 flex-row overflow-hidden relative">
          <div
            className={`
            flex flex-col w-72 border-r border-whispr-border bg-whispr-bg-primary
            md:relative md:translate-x-0
            absolute inset-y-0 left-0 z-20 transition-transform duration-300
            ${showPresence ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
          >
            <div className="flex-1 overflow-y-auto">
              <PresenceStatus currentUsername={username} />
            </div>
            <button
              onClick={() => setShowPresence(false)}
              className="md:hidden absolute top-4 right-4 p-2 bg-whispr-bg-secondary rounded-lg hover:bg-whispr-bg-tertiary transition-colors"
              aria-label="Close presence panel"
            >
              <svg
                className="w-5 h-5 text-whispr-text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {showPresence && (
            <div
              className="md:hidden absolute inset-0 bg-black/50 z-10"
              onClick={() => setShowPresence(false)}
              aria-label="Close presence panel overlay"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowPresence(false);
                }
              }}
            />
          )}

          <div className="flex flex-col flex-1">
            <ChatBox username={username} roomId={roomId} />
          </div>
        </div>
      </div>
    </ChatRoomProvider>
  );
}
