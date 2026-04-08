import type React from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "violet" | "none";
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function GlassPanel({
  children,
  className = "",
  glowColor = "none",
  style,
  onClick,
}: GlassPanelProps) {
  const glowClass =
    glowColor === "cyan"
      ? "glow-cyan"
      : glowColor === "violet"
        ? "glow-violet"
        : "";
  return (
    <div
      className={`glass ${glowClass} ${className}`}
      style={style}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
