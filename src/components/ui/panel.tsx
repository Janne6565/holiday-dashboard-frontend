import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** The dark card container used throughout both screens. */
export function Panel({ children, className, style }: PanelProps) {
  return (
    <div
      className={cn("bg-panel rounded-card border border-white/[0.07]", className)}
      style={style}
    >
      {children}
    </div>
  );
}
