import { MESSAGE_RETENTION_HOURS } from "@/lib/constants";

interface EmptyStateProps {
  roomId: string;
}

export function EmptyState({ roomId }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md px-6">
        <h2 className="text-2xl font-bold text-whispr-text-primary mb-3">
          Welcome to room {roomId}!
        </h2>
        <p className="text-sm text-whispr-text-secondary leading-relaxed mb-4">
          Be the first to say something. Start a conversation and invite others
          to join.
        </p>
        <p className="text-xs text-whispr-text-muted italic">
          Messages are automatically deleted after {MESSAGE_RETENTION_HOURS} hours
        </p>
      </div>
    </div>
  );
}

