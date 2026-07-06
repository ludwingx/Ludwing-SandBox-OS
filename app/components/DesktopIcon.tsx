"use client";

import { useCallback, useState } from "react";
import type { AppDefinition } from "@/app/types";

interface DesktopIconProps {
  app: AppDefinition;
  onDoubleClick: (appId: string) => void;
}

/**
 * Desktop shortcut icon styled like Windows 2000.
 * Shows app icon + name label with classic text shadow.
 * Double-click opens the app window.
 */
export default function DesktopIcon({ app, onDoubleClick }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleDoubleClick = useCallback(() => {
    onDoubleClick(app.id);
  }, [app.id, onDoubleClick]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsSelected(true);
    },
    []
  );

  const IconComponent = app.icon;

  return (
    <div
      className={`flex flex-col items-center justify-start gap-1 p-1 cursor-pointer w-[76px] ${
        isSelected ? "win2k-icon-selected" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={() => setIsSelected(false)}
      tabIndex={0}
      role="button"
      aria-label={`Open ${app.name}`}
    >
      {/* Icon */}
      <div
        className={`w-[32px] h-[32px] flex items-center justify-center ${
          isSelected ? "brightness-110" : ""
        }`}
      >
        <IconComponent
          size={32}
          color={isSelected ? "#FFFFFF" : "#FFFFFF"}
          strokeWidth={1.5}
        />
      </div>

      {/* Label */}
      <span
        className={`win2k-icon-text leading-tight ${
          isSelected ? "bg-[#0A246A] text-white" : ""
        }`}
        style={{
          textShadow: isSelected ? "none" : "1px 1px 2px rgba(0,0,0,0.9)",
        }}
      >
        {app.name}
      </span>
    </div>
  );
}
