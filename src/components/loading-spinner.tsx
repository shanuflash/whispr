interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeClasses[size]} border-whispr-border border-t-whispr-accent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-whispr-text-secondary uppercase tracking-[0.15em] font-semibold">
          {message}
        </p>
      )}
    </div>
  );
}

