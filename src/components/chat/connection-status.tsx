"use client";

import { useChatConnection } from "@ably/chat/react";

export function ConnectionStatus() {
  const { currentStatus } = useChatConnection();
  
  return (
    <div className="px-6 py-5 h-full bg-whispr-bg-secondary border-r border-whispr-border flex items-center">
      <div className="flex items-center gap-2.5">
        <div
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentStatus === "connected"
              ? "bg-whispr-accent shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              : "bg-whispr-text-secondary shadow-[0_0_10px_rgba(136,136,136,0.5)]"
          }`}
          role="status"
          aria-label={`Connection status: ${currentStatus}`}
        />
        <span className="text-xs text-whispr-text-secondary font-semibold uppercase tracking-[0.1em]">
          {currentStatus}
        </span>
      </div>
    </div>
  );
}

