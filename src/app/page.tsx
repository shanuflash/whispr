"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  const handleCreateRoom = () => {
    setIsCreating(true);
    const newRoomId = generateRoomId();
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      router.push(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-whispr-bg-primary flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-20">
          <h1 className="text-7xl md:text-8xl font-bold text-whispr-text-primary mb-6 tracking-tight">
            WHISPR
          </h1>
          <p className="text-sm text-whispr-text-secondary uppercase tracking-[0.2em] font-medium">
            Real-time messaging for teams
          </p>
        </div>

        <div className="space-y-5 mb-16">
          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="w-full bg-whispr-accent text-whispr-bg-primary py-6 rounded-xl hover:bg-whispr-text-primary transition-all duration-200 text-left px-8 group disabled:opacity-50 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold mb-1.5">Create Room</div>
                <div className="text-xs text-whispr-bg-primary/70 tracking-wide">
                  {isCreating ? "Creating..." : "Start a new conversation"}
                </div>
              </div>
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>

          <form
            onSubmit={handleJoinRoom}
            className="bg-whispr-bg-secondary border border-whispr-border backdrop-blur-xl rounded-xl overflow-hidden"
          >
            <div className="p-8">
              <div className="text-xs text-whispr-text-secondary uppercase tracking-[0.15em] mb-5 font-medium">
                Join Existing Room
              </div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full bg-whispr-bg-primary border border-whispr-border rounded-lg px-4 py-3.5 text-whispr-text-primary placeholder:text-whispr-text-muted outline-none focus:border-whispr-text-secondary focus:ring-2 focus:ring-whispr-text-muted/20 transition-all text-base mb-6"
              />
              <button
                type="submit"
                disabled={!roomId.trim()}
                className="w-full bg-whispr-border text-whispr-text-primary py-3.5 rounded-lg hover:bg-whispr-bg-tertiary transition-all duration-200 text-sm uppercase tracking-[0.1em] font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Join Room
              </button>
            </div>
          </form>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-whispr-text-muted italic">
            All messages are automatically deleted after 24 hours
          </p>
          <p className="text-[10px] text-whispr-text-muted uppercase tracking-[0.15em] font-medium">
            Powered by Ably
          </p>
        </div>
      </div>
    </div>
  );
}
