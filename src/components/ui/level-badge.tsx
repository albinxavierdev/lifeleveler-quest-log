
import * as React from "react";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  className,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/20 font-semibold text-primary",
        sizeClasses[size],
        className
      )}
    >
      {level}
    </div>
  );
};

export { LevelBadge };
