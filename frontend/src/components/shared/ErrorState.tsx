import { Loader2, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

const ErrorState = ({
  title = "Can't reach the server",
  message = "Check your connection and try again.",
  onRetry,
  isRetrying = false,
  className,
}: ErrorStateProps) => {
  return (
    <section
      role="alert"
      className={cn(
        "mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-error-container/60 bg-card px-8 py-12 text-center",
        className,
      )}
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-error-container/30 ring-1 ring-error-container">
        <ServerCrash className="size-9 text-error" aria-hidden />
      </div>

      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>

      {onRetry && (
        <Button onClick={onRetry} disabled={isRetrying} className="mt-2 gap-2">
          {isRetrying && (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          )}
          {isRetrying ? "Trying..." : "Try again"}
        </Button>
      )}
    </section>
  );
};

export default ErrorState;
