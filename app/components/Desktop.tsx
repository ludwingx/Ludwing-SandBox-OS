"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { APP_REGISTRY } from "@/app/config/apps";
import { useWindowManager } from "@/app/hooks/useWindowManager";
import DesktopIcon from "./DesktopIcon";
import Window from "./Window";
import Taskbar from "./Taskbar";

// App content components
import LaMovidaApp from "./apps/LaMovidaApp";
import MarketGSApp from "./apps/MarketGSApp";
import MaryJaneApp from "./apps/MaryJaneApp";
import PhronAgentsApp from "./apps/PhronAgentsApp";

/** Map of appId → React component */
const APP_COMPONENTS: Record<string, React.ComponentType> = {
  lamovidabo: LaMovidaApp,
  marketgs: MarketGSApp,
  maryjaneai: MaryJaneApp,
  phronagents: PhronAgentsApp,
};

/**
 * Main Desktop component — the OS surface.
 * Renders wallpaper, desktop icons, floating windows, and taskbar.
 * Reads ?app= query param to auto-open a window on load.
 */
export default function Desktop() {
  const searchParams = useSearchParams();
  const wm = useWindowManager();

  // Auto-open app from query params on mount
  useEffect(() => {
    const appParam = searchParams.get("app");
    if (appParam && APP_COMPONENTS[appParam]) {
      // Small delay to ensure mount is complete
      const timer = setTimeout(() => {
        wm.openWindow(appParam);
      }, 100);
      return () => clearTimeout(timer);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deselect icons when clicking on empty desktop
  const handleDesktopClick = useCallback(() => {
    // Desktop click - deselect any selected icons by blurring active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col select-none"
      style={{ background: "#3A6EA5" }}
    >
      {/* ===== DESKTOP SURFACE ===== */}
      <div
        className="flex-1 relative"
        onClick={handleDesktopClick}
        style={{ paddingBottom: "30px" }} // space for taskbar
      >
        {/* Desktop Icons (vertical column, left side) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {APP_REGISTRY.map((app) => (
            <DesktopIcon
              key={app.id}
              app={app}
              onDoubleClick={wm.openWindow}
            />
          ))}
        </div>

        {/* ===== FLOATING WINDOWS ===== */}
        {wm.windows.map((win) => {
          const AppContent = APP_COMPONENTS[win.appId];
          if (!AppContent) return null;

          return (
            <Window
              key={win.id}
              windowState={win}
              isActive={win.id === wm.activeWindowId}
              onClose={wm.closeWindow}
              onMinimize={wm.minimizeWindow}
              onToggleMaximize={wm.toggleMaximize}
              onBringToFront={wm.bringToFront}
              onUpdatePosition={wm.updatePosition}
            >
              <AppContent />
            </Window>
          );
        })}
      </div>

      {/* ===== TASKBAR ===== */}
      <Taskbar
        windows={wm.windows}
        activeWindowId={wm.activeWindowId}
        onRestoreWindow={wm.restoreWindow}
        onMinimizeWindow={wm.minimizeWindow}
        onBringToFront={wm.bringToFront}
        onOpenApp={wm.openWindow}
      />
    </div>
  );
}
