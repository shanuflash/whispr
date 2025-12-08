import { AVATAR_GRADIENTS } from "@/lib/constants";
import type { AvatarSize } from "@/lib/types";

interface AvatarProps {
  username: string;
  size?: AvatarSize;
}

function getAvatarGradient(username: string): string {
  const hash = username.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function getInitials(username: string): string {
  return username.charAt(0).toUpperCase();
}

export function Avatar({ username, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${getAvatarGradient(username)} rounded-full flex items-center justify-center font-bold text-whispr-bg-primary shadow-lg`}
      aria-label={`${username}'s avatar`}
    >
      {getInitials(username)}
    </div>
  );
}
