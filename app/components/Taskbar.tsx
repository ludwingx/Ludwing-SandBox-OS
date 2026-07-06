"use client";

import { useState, useCallback } from "react";
import { Monitor } from "lucide-react";
import type { WindowState } from "@/app/types";
import { getAppById } from "@/app/config/apps";
import StartMenu from "./StartMenu";
import Clock from "./Clock";

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onRestoreWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onBringToFront: (id: string) => void;
  onOpenApp: (appId: string) => void;
}

/**
 * Windows 2000 Taskbar.
 * Bottom bar with Start button, open window buttons, and system tray.
 */
export default function Taskbar({
  windows,
  activeWindowId,
  onRestoreWindow,
  onMinimizeWindow,
  onBringToFront,
  onOpenApp,
}: TaskbarProps) {
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen((prev) => !prev);
  }, []);

  const closeStartMenu = useCallback(() => {
    setStartMenuOpen(false);
  }, []);

  /** Handle taskbar button click for a window */
  const handleWindowButtonClick = useCallback(
    (win: WindowState) => {
      if (win.isMinimized) {
        // Restore from minimized
        onRestoreWindow(win.id);
      } else if (win.id === activeWindowId) {
        // If active, minimize it
        onMinimizeWindow(win.id);
      } else {
        // Bring to front
        onBringToFront(win.id);
      }
    },
    [activeWindowId, onRestoreWindow, onMinimizeWindow, onBringToFront]
  );

  return (
    <div className="relative" style={{ zIndex: 9999 }}>
      {/* Start Menu (above taskbar) */}
      <StartMenu
        isOpen={startMenuOpen}
        onClose={closeStartMenu}
        onOpenApp={onOpenApp}
      />

      {/* ===== TASKBAR ===== */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[30px] flex items-center px-[2px] gap-[2px]"
        style={{
          background: "#C0C0C0",
          borderTop: "2px solid #FFFFFF",
        }}
      >
        {/* === START BUTTON === */}
        <button
          className={`flex items-center gap-1 px-2 h-[22px] font-bold text-[11px] ${
            startMenuOpen ? "win2k-button-pressed" : "win2k-button"
          }`}
          onClick={toggleStartMenu}
          style={{ minWidth: "54px" }}
        >
          {/* Windows Flag Icon */}
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="0" y="0" width="6" height="6" fill="#FF0000" />
            <rect x="7" y="0" width="6" height="6" fill="#00FF00" />
            <rect x="0" y="7" width="6" height="6" fill="#0000FF" />
            <rect x="7" y="7" width="6" height="6" fill="#FFFF00" />
          </svg>
          <span>Start</span>
        </button>

        {/* === SEPARATOR === */}
        <div className="h-[20px] mx-[2px]" style={{ borderLeft: "1px solid #808080", borderRight: "1px solid #FFFFFF" }} />

        {/* === QUICK LAUNCH === */}
        <div className="flex items-center gap-[2px] px-1">
          <button
            className="w-[20px] h-[20px] flex items-center justify-center hover:bg-[#B8B8B8] active:bg-[#A0A0A0]"
            title="Show Desktop"
          >
            <Monitor size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* === SEPARATOR === */}
        <div className="h-[20px] mx-[2px]" style={{ borderLeft: "1px solid #808080", borderRight: "1px solid #FFFFFF" }} />

        {/* === OPEN WINDOW BUTTONS === */}
        <div className="flex-1 flex items-center gap-[2px] overflow-hidden">
          {windows.map((win) => {
            const app = getAppById(win.appId);
            const isActive = win.id === activeWindowId && !win.isMinimized;
            const IconComponent = app?.icon;

            return (
              <button
                key={win.id}
                className={`win2k-taskbar-button ${
                  isActive ? "win2k-taskbar-button-active" : ""
                }`}
                onClick={() => handleWindowButtonClick(win)}
                title={app?.name}
              >
                {IconComponent && (
                  <IconComponent size={14} strokeWidth={1.5} />
                )}
                <span className="truncate text-[11px]">
                  {app?.name ?? "Window"}
                </span>
              </button>
            );
          })}
        </div>

        {/* === SYSTEM TRAY === */}
        <div className="h-[20px] mx-[2px]" style={{ borderLeft: "1px solid #808080", borderRight: "1px solid #FFFFFF" }} />

        <div className="flex items-center gap-1">
          <Clock />
        </div>
      </div>
    </div>
  );
}
