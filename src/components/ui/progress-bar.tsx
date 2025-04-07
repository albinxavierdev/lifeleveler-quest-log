
import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  showValue?: boolean;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  className,
  barClassName,
  showValue = false,
  label
}) => {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn("w-full space-y-1", className)}>
      {label && (
        <div className="flex justify-between text-xs">
          <span>{label}</span>
          {showValue && (
            <span className="text-muted-foreground">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full bg-primary transition-all", barClassName)}
          style={{ width: `${percent}%` }}
        />
      </div>
      {!label && showValue && (
        <div className="text-right text-xs text-muted-foreground">
          {value}/{max}
        </div>
      )}
    </div>
  );
};

export { ProgressBar };
