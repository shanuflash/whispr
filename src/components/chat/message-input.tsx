"use client";

import { useState, useCallback } from "react";
import { Send } from "lucide-react";
import { useTyping } from "@ably/chat/react";
import { validateMessage } from "@/lib/validation";
import { createRateLimiter } from "@/lib/validation";
import { MESSAGE_SEND_COOLDOWN_MS, MESSAGE_RETENTION_HOURS } from "@/lib/constants";

interface MessageInputProps {
  username: string;
  onSendMessage: (text: string) => Promise<void>;
}

const sendRateLimiter = createRateLimiter(MESSAGE_SEND_COOLDOWN_MS);

export function MessageInput({ username, onSendMessage }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { currentlyTyping, keystroke, stop } = useTyping();

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isSending) return;

    // Rate limiting
    if (!sendRateLimiter.canProceed()) {
      setError("Please wait before sending another message");
      setTimeout(() => setError(""), 2000);
      return;
    }

    const result = validateMessage(inputValue);
    
    if (!result.success) {
      setError(result.error || "Invalid message");
      return;
    }

    if (!result.data) return;

    setIsSending(true);
    try {
      await onSendMessage(result.data);
      setInputValue("");
      setError("");
      await stop();
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  }, [inputValue, isSending, onSendMessage, stop, username]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setError("");

      
      if (newValue.trim().length > 0) {
        keystroke().catch((err) => console.error("Error starting typing:", err));
      } else {
        stop().catch((err) => console.error("Error stopping typing:", err));
      }
    },
    [keystroke, stop],
  );

  const othersTyping = Array.from(currentlyTyping).filter(
    (id) => id !== username,
  );

  return (
    <>
      <div className="px-3 md:px-6 pb-3 h-8 flex items-center">
        {othersTyping.length > 0 && (
          <div className="flex items-center gap-2" role="status" aria-live="polite">
            <div className="flex gap-1" aria-hidden="true">
              <span
                className="w-1.5 h-1.5 bg-whispr-accent rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-whispr-accent rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 bg-whispr-accent rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <p className="text-xs text-whispr-text-secondary font-medium truncate">
              {othersTyping.join(", ")}{" "}
              {othersTyping.length === 1 ? "is" : "are"} typing...
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-whispr-border bg-whispr-bg-secondary">
        <div className="px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <label htmlFor="message-input" className="sr-only">
              Type a message
            </label>
            <input
              id="message-input"
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-whispr-bg-primary border-2 border-whispr-border rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-whispr-text-primary placeholder:text-whispr-text-muted outline-none focus:border-whispr-text-muted focus:ring-2 focus:ring-whispr-text-muted/20 transition-all duration-200 text-sm"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              disabled={isSending}
              aria-invalid={!!error}
              aria-describedby={error ? "message-error" : undefined}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSending}
              className="bg-whispr-accent text-whispr-bg-primary p-2.5 md:p-3 rounded-full hover:bg-whispr-text-primary md:hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-90"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          {error && (
            <p id="message-error" className="text-whispr-error text-xs mb-2" role="alert">
              {error}
            </p>
          )}
          <p className="text-[10px] text-whispr-text-muted italic text-center hidden md:block">
            like a real whisper, these messages fade away in {MESSAGE_RETENTION_HOURS} hours
          </p>
        </div>
      </div>
    </>
  );
}

