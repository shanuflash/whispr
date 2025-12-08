// Shared type definitions
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type AvatarSize = "sm" | "md" | "lg";

export interface UserPresence {
  clientId: string;
  timestamp: number;
}

export type SystemMessageType = "join" | "leave";

export interface SystemMessage {
  type: "system";
  systemType: SystemMessageType;
  username: string;
  timestamp: number;
  id: string;
}

export interface ChatMessage {
  type: "message";
  data: any;
}

export type MessageItem = SystemMessage | ChatMessage;
