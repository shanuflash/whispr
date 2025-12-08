"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useMessages } from "@ably/chat/react";
import { ChatMessageEvent, Message, ChatMessageEventType } from "@ably/chat";
import { EmptyState } from "./empty-state";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { MESSAGE_HISTORY_LIMIT } from "@/lib/constants";

interface ChatBoxProps {
  username: string;
  roomId: string;
}

export function ChatBox({ username, roomId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { sendMessage, updateMessage, historyBeforeSubscribe } = useMessages({
    listener: (event: ChatMessageEvent) => {
      const message = event.message;
      switch (event.type) {
        case ChatMessageEventType.Created: {
          setMessages((prevMessages) => [...prevMessages, message]);
          break;
        }
        case ChatMessageEventType.Updated: {
          setMessages((prevMessages) => {
            const index = prevMessages.findIndex(
              (other) => other.serial === message.serial,
            );
            if (index === -1) {
              return prevMessages;
            }
            const updatedArray = prevMessages.slice();
            updatedArray[index] = message;
            return updatedArray;
          });
          break;
        }
        default: {
          console.error("Unhandled event:", event);
        }
      }
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        if (!historyBeforeSubscribe) {
          return;
        }
        const history = await historyBeforeSubscribe({ limit: MESSAGE_HISTORY_LIMIT });
        setMessages(history.items.reverse());
      } catch (error) {
        console.error("Error loading message history:", error);
      }
    };
    loadHistory();
  }, [historyBeforeSubscribe]);

  const onUpdateMessage = useCallback(
    (message: Message) => {
      if (message.clientId !== username) {
        return;
      }
      // TODO: Replace browser prompt with a proper modal/dialog component for better UX
      const newText = prompt("Enter new text");
      if (!newText) {
        return;
      }
      updateMessage(message.serial, {
        text: newText,
        metadata: message.metadata,
        headers: message.headers,
      }).catch((error: unknown) => {
        console.warn("Failed to update message", error);
      });
    },
    [updateMessage, username],
  );

  const handleSendMessage = useCallback(
    async (text: string) => {
      await sendMessage({ text });
    },
    [sendMessage],
  );

  return (
    <div className="flex flex-col w-full h-full bg-whispr-bg-primary">
      <main
        className="flex-1 px-3 md:px-6 pt-4 md:pt-6 pb-3 overflow-y-auto"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <EmptyState roomId={roomId} />
        ) : (
          <MessageList
            messages={messages}
            currentUsername={username}
            onUpdateMessage={onUpdateMessage}
          />
        )}
        <div ref={messagesEndRef} />
      </main>

      <MessageInput username={username} onSendMessage={handleSendMessage} />
    </div>
  );
}

