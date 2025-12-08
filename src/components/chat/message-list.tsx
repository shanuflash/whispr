"use client";

import { useState } from "react";
import type { Message } from "@ably/chat";
import { Avatar } from "./avatar";
import type { MessageItem } from "@/lib/types";
import { Trash2 } from "lucide-react";

interface MessageListProps {
  items: MessageItem[];
  currentUsername: string;
  onUpdateMessage: (message: Message) => void;
  onDeleteMessage: (message: Message) => void;
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

function SystemMessage({
  username,
  type,
}: {
  username: string;
  type: "join" | "leave";
}) {
  const isYou = username === "You";
  return (
    <div className="flex justify-center my-4">
      <div className="bg-whispr-bg-secondary px-4 py-2 rounded-full border border-whispr-border">
        <p className="text-xs text-whispr-text-secondary">
          <span className="font-semibold text-whispr-text-primary">
            {username}
          </span>
          {type === "join"
            ? isYou
              ? " joined the room"
              : " joined the room"
            : isYou
              ? " left the room"
              : " left the room"}
        </p>
      </div>
    </div>
  );
}

export function MessageList({
  items,
  currentUsername,
  onUpdateMessage,
  onDeleteMessage,
}: MessageListProps) {
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  // TODO: For large message lists (>500 messages), consider implementing virtualization
  // using react-window or react-virtualized for better performance. Current limit of 100
  // messages is reasonable for MVP scope.

  return (
    <>
      {items.map((item, idx) => {
        // system messages
        if (item.type === "system") {
          return (
            <SystemMessage
              key={item.id}
              username={item.username}
              type={item.systemType}
            />
          );
        }

        // regular messages
        const msg = item.data;
        const isMine = msg.clientId === currentUsername;

        const prevItem = idx > 0 ? items[idx - 1] : null;
        const nextItem = idx < items.length - 1 ? items[idx + 1] : null;

        const prevMsg = prevItem?.type === "message" ? prevItem.data : null;
        const nextMsg = nextItem?.type === "message" ? nextItem.data : null;

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

        const isHovered = hoveredMessage === msg.serial;

        return (
          <article
            key={msg.serial || idx}
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

              <div className="flex flex-col flex-1 min-w-0 relative">
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

                <div className="relative group">
                  <div
                    onClick={() => isMine && onUpdateMessage(msg)}
                    onKeyDown={(e) => {
                      if (isMine && (e.key === "Enter" || e.key === " ")) {
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
                    } transition-all duration-200 ${borderRadius} shadow-sm`}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {msg.text}
                    </p>
                  </div>

                  {isMine && isHovered && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMessage(msg);
                      }}
                      className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 bg-whispr-bg-secondary hover:bg-whispr-error/20 text-whispr-text-muted hover:text-whispr-error rounded-lg transition-all duration-200 shadow-lg"
                      aria-label="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </>
  );
}
