"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRoom } from "@ably/chat/react";

interface RoomStatusProps {
  roomId: string;
  onTogglePresence: () => void;
}

export function RoomStatus({ roomId, onTogglePresence }: RoomStatusProps) {
  const router = useRouter();
  const [currentRoomStatus, setCurrentRoomStatus] = useState("");
  
  useRoom({
    onStatusChange: (status) => {
      setCurrentRoomStatus(status.current);
    },
  });

  return (
    <div className="px-4 md:px-6 py-5 h-full bg-whispr-bg-secondary flex items-center justify-between gap-2 md:gap-4">
      <button
        onClick={onTogglePresence}
        className="md:hidden p-2 bg-whispr-border hover:bg-whispr-bg-tertiary text-whispr-text-primary transition-all duration-200 rounded-lg"
        aria-label="Toggle presence panel"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </button>
      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
        <span className="text-xs text-whispr-text-muted uppercase tracking-[0.1em] font-semibold hidden md:inline">
          Room
        </span>
        <span className="text-xs md:text-sm text-whispr-text-primary font-mono truncate bg-whispr-bg-primary px-2 md:px-3 py-1.5 rounded-md">
          {roomId}
        </span>
      </div>
      <button
        onClick={() => router.push("/")}
        className="px-3 md:px-4 py-2 bg-whispr-border hover:bg-whispr-accent hover:text-whispr-bg-primary hover:scale-105 text-xs text-whispr-text-primary transition-all duration-200 uppercase tracking-[0.1em] font-semibold rounded-lg shadow-sm hover:shadow-md"
      >
        Exit
      </button>
    </div>
  );
}

