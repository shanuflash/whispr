import { z } from "zod";
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from "./constants";
import type { ValidationResult } from "./types";

// Username validation schema
const usernameSchema = z
  .string()
  .min(
    USERNAME_MIN_LENGTH,
    `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
  )
  .max(
    USERNAME_MAX_LENGTH,
    `Username must be less than ${USERNAME_MAX_LENGTH} characters`,
  )
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, hyphens, and underscores",
  )
  .refine((val) => !val.includes(" "), "Username cannot contain spaces");

// Message validation schema
const messageSchema = z
  .string()
  .min(1, "Message cannot be empty")
  .max(2000, "Message is too long");

// Validation functions
export function validateUsername(username: string): ValidationResult<string> {
  try {
    const trimmed = username.trim();
    const validated = usernameSchema.parse(trimmed);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Invalid username" };
  }
}

export function validateMessage(message: string): ValidationResult<string> {
  try {
    const trimmed = message.trim();
    const validated = messageSchema.parse(trimmed);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Invalid message" };
  }
}

// Rate limiting helper
export function createRateLimiter(cooldownMs: number) {
  let lastCall = 0;

  return {
    canProceed: (): boolean => {
      const now = Date.now();
      if (now - lastCall >= cooldownMs) {
        lastCall = now;
        return true;
      }
      return false;
    },
    reset: (): void => {
      lastCall = 0;
    },
  };
}
