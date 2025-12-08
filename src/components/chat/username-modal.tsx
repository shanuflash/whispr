"use client";

import { useState } from "react";
import { validateUsername } from "@/lib/validation";
import { USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH } from "@/lib/constants";

interface UsernameModalProps {
  onSubmit: (username: string) => void;
}

export function UsernameModal({ onSubmit }: UsernameModalProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateUsername(username);

    if (!result.success) {
      setError(result.error || "Invalid username");
      return;
    }

    if (result.data) {
      onSubmit(result.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-whispr-bg-primary/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div
        className="bg-whispr-bg-secondary backdrop-blur-2xl border border-whispr-border rounded-2xl p-12 max-w-md w-full shadow-2xl"
        role="dialog"
        aria-labelledby="username-modal-title"
        aria-describedby="username-modal-description"
      >
        <div className="mb-8">
          <h2
            id="username-modal-title"
            className="text-3xl font-bold text-whispr-text-primary mb-3 tracking-tight"
          >
            Enter Username
          </h2>
          <p
            id="username-modal-description"
            className="text-sm text-whispr-text-secondary tracking-wide"
          >
            Choose your display name to join the conversation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username-input" className="sr-only">
              Username
            </label>
            <input
              id="username-input"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Username"
              className="w-full bg-whispr-bg-primary border border-whispr-border rounded-lg px-4 py-3.5 text-whispr-text-primary placeholder:text-whispr-text-muted outline-none focus:border-whispr-text-secondary focus:ring-2 focus:ring-whispr-text-muted/20 transition-all text-lg"
              autoFocus
              aria-invalid={!!error}
              aria-describedby={error ? "username-error" : "username-hint"}
            />
            {error && (
              <p
                id="username-error"
                className="text-whispr-error text-sm mt-3 font-medium"
                role="alert"
              >
                {error}
              </p>
            )}
            <p
              id="username-hint"
              className="text-whispr-text-muted text-xs mt-3 tracking-wide"
            >
              No spaces • {USERNAME_MIN_LENGTH}-{USERNAME_MAX_LENGTH} characters
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-whispr-accent text-whispr-bg-primary py-4 rounded-lg hover:bg-whispr-text-primary transition-all duration-200 text-sm uppercase tracking-[0.1em] font-semibold shadow-lg"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
