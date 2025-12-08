"use client";

import { useEffect, useState } from "react";
import { usePresence, usePresenceListener, useRoom } from "@ably/chat/react";
import { Avatar } from "./avatar";

interface PresenceStatusProps {
  currentUsername: string;
}

export function PresenceStatus({ currentUsername }: PresenceStatusProps) {
  const [isRoomAttached, setIsRoomAttached] = useState(false);
  const { enter } = usePresence();
  const { presenceData } = usePresenceListener();

  useRoom({
    onStatusChange: (change) => {
      if (change.current === "attached") {
        setIsRoomAttached(true);
      }
    },
  });

  useEffect(() => {
    if (isRoomAttached) {
      enter().catch((err) => console.error("Error entering presence:", err));
    }
  }, [isRoomAttached, enter]);

  return (
    <aside
      className="flex flex-col bg-whispr-bg-primary w-full h-full px-6 py-6"
      aria-label="Online users"
    >
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-whispr-text-muted">
          Online · {presenceData.length}
        </h3>
      </div>
      <div className="flex-1 flex-col flex flex-nowrap items-start gap-3 overflow-y-auto">
        {presenceData.map((member, idx) => {
          const isCurrentUser = member.clientId === currentUsername;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 w-full group cursor-pointer transition-all duration-200 hover:bg-whispr-bg-secondary px-2 py-1.5 rounded-lg -mx-2"
            >
              <div className="relative">
                <Avatar username={member.clientId} size="md" />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-whispr-accent rounded-full border-2 border-whispr-bg-primary shadow-[0_0_6px_rgba(255,255,255,0.5)]"
                  aria-label="Online"
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-whispr-text-primary group-hover:text-white transition-colors font-medium">
                  {member.clientId}
                </span>
                {isCurrentUser && (
                  <span className="text-xs text-whispr-text-muted">(you)</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-whispr-border">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-whispr-text-muted mb-3">
          Coming Soon
        </h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-whispr-text-muted" />
            <span className="text-xs text-whispr-text-secondary">
              Password protected rooms
            </span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-whispr-text-muted" />
            <span className="text-xs text-whispr-text-secondary">
              Room roles (owner, admin)
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
