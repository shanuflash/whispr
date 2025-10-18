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
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-20">
          <h1 className="text-7xl md:text-8xl font-bold text-[#EAEAEA] mb-6 tracking-tight">
            WHISPR
          </h1>
          <p className="text-sm text-[#888888] uppercase tracking-[0.2em] font-medium">
            Real-time messaging for teams
          </p>
        </div>

        <div className="space-y-5 mb-16">
          <button
            onClick={handleCreateRoom}
            disabled={isCreating}
            className="w-full bg-[#FFFFFF] text-[#111111] py-6 rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 text-left px-8 group disabled:opacity-50 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold mb-1.5">Create Room</div>
                <div className="text-xs text-[#111111]/70 tracking-wide">
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
            className="bg-[#191919] border border-[#2A2A2A] backdrop-blur-xl rounded-xl overflow-hidden"
          >
            <div className="p-8">
              <div className="text-xs text-[#888888] uppercase tracking-[0.15em] mb-5 font-medium">
                Join Existing Room
              </div>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-4 py-3.5 text-[#EAEAEA] placeholder:text-[#555555] outline-none focus:border-[#FFFFFF] focus:ring-2 focus:ring-[#FFFFFF]/20 transition-all text-base mb-6"
              />
              <button
                type="submit"
                disabled={!roomId.trim()}
                className="w-full bg-[#2A2A2A] text-[#EAEAEA] py-3.5 rounded-lg hover:bg-[#333333] transition-all duration-200 text-sm uppercase tracking-[0.1em] font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Join Room
              </button>
            </div>
          </form>
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-[#555555] italic">
            All messages are automatically deleted after 24 hours
          </p>
          <p className="text-[10px] text-[#555555] uppercase tracking-[0.15em] font-medium">
            Powered by Ably
          </p>
        </div>
      </div>
    </div>
  );
}
