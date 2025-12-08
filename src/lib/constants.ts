// Application constants
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 20;
export const MESSAGE_HISTORY_LIMIT = 100;
export const ROOM_ID_LENGTH = 8;
export const MESSAGE_RETENTION_HOURS = 24;

// Rate limiting
export const TYPING_DEBOUNCE_MS = 300;
export const MESSAGE_SEND_COOLDOWN_MS = 100;

// UI constants
export const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-[#FFFFFF] to-[#CCCCCC]",
  "bg-gradient-to-br from-[#EAEAEA] to-[#999999]",
  "bg-gradient-to-br from-[#DDDDDD] to-[#888888]",
  "bg-gradient-to-br from-[#F5F5F5] to-[#AAAAAA]",
  "bg-gradient-to-br from-[#E0E0E0] to-[#777777]",
  "bg-gradient-to-br from-[#FFFFFF] to-[#AAAAAA]",
  "bg-gradient-to-br from-[#F0F0F0] to-[#999999]",
  "bg-gradient-to-br from-[#E5E5E5] to-[#666666]",
] as const;
