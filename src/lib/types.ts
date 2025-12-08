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

