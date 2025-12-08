"use client";

import { useState } from "react";
import type { Message } from "@ably/chat";
import { Avatar } from "./avatar";

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
  onUpdateMessage: (message: Message) => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

export function MessageList({
  messages,
  currentUsername,
  onUpdateMessage,
}: MessageListProps) {
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  // TODO: For large message lists (>500 messages), consider implementing virtualization
  // using react-window or react-virtualized for better performance. Current limit of 100
  // messages is reasonable for MVP scope.

  return (
    <>
      {messages.map((msg: Message, idx: number) => {
        const isMine = msg.clientId === currentUsername;
        const prevMsg = idx > 0 ? messages[idx - 1] : null;
        const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;

        const isFirstInGroup = !prevMsg || prevMsg.clientId !== msg.clientId;
        const isLastInGroup = !nextMsg || nextMsg.clientId !== msg.clientId;
        const isMiddleInGroup = !isFirstInGroup && !isLastInGroup;

        let borderRadius = "rounded-2xl";
        if (isFirstInGroup && !isLastInGroup) {
          borderRadius = isMine
            ? "rounded-2xl rounded-br-md"
            : "rounded-2xl rounded-bl-md";
        } else if (isMiddleInGroup) {
          borderRadius = isMine
            ? "rounded-2xl rounded-br-md rounded-tr-md"
            : "rounded-2xl rounded-bl-md rounded-tl-md";
        } else if (!isFirstInGroup && isLastInGroup) {
          borderRadius = isMine
            ? "rounded-2xl rounded-tr-md"
            : "rounded-2xl rounded-tl-md";
        }

        return (
          <article
            key={idx}
            className={`flex ${isMine ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-6" : "mt-0.5"} animate-in fade-in slide-in-from-bottom-2 duration-200`}
            onMouseEnter={() => setHoveredMessage(msg.serial)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            <div
              className={`flex gap-2 md:gap-3 max-w-[85%] md:max-w-[75%] ${isMine ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isMine && (
                <div
                  className={`flex-shrink-0 w-6 ${isFirstInGroup ? "" : "invisible"}`}
                >
                  <Avatar username={msg.clientId} size="sm" />
                </div>
              )}

              <div className="flex flex-col flex-1 min-w-0">
                {isFirstInGroup && (
                  <div
                    className={`flex items-baseline gap-2 mb-1.5 ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <span className="text-xs text-[var(--whispr-text-primary)] font-semibold">
                      {msg.clientId}
                    </span>
                    {msg.timestamp && (
                      <time
                        className="text-[10px] text-[var(--whispr-text-muted)]"
                        dateTime={new Date(msg.timestamp).toISOString()}
                      >
                        {formatTime(new Date(msg.timestamp).getTime())}
                      </time>
                    )}
                  </div>
                )}

                <div
                  onClick={() => onUpdateMessage(msg)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onUpdateMessage(msg);
                    }
                  }}
                  role={isMine ? "button" : undefined}
                  tabIndex={isMine ? 0 : undefined}
                  aria-label={isMine ? "Edit message" : undefined}
                  className={`px-3 md:px-4 py-2 md:py-2.5 ${
                    isMine
                      ? "bg-[var(--whispr-accent)] text-[var(--whispr-bg-primary)] cursor-pointer hover:bg-[var(--whispr-text-primary)] hover:shadow-lg md:hover:scale-[1.02]"
                      : "bg-[var(--whispr-bg-secondary)] text-[var(--whispr-text-primary)] hover:bg-[var(--whispr-bg-tertiary)]"
                  } transition-all duration-200 ${borderRadius} shadow-sm group-hover:shadow-md`}
                >
                  <p className="text-sm leading-relaxed break-words">
                    {msg.text}
                  </p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </>
  );
}

