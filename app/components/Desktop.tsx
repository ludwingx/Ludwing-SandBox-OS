"use client";

import { useEffect, useCallback, useState, useRef } from "react";
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

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggedIconId, setDraggedIconId] = useState<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [wallpaperColor, setWallpaperColor] = useState("#3A6EA5");

  // Initialize icon positions
  useEffect(() => {
    const initial: Record<string, { x: number; y: number }> = {};
    APP_REGISTRY.forEach((app, index) => {
      initial[app.id] = {
        x: 12,
        y: 12 + index * 80,
      };
    });
    setPositions(initial);
  }, []);

  // Handle drag movement of icons
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!draggedIconId) return;
      const newX = e.clientX - dragOffsetRef.current.x;
      const newY = e.clientY - dragOffsetRef.current.y;

      // Bound within the desktop surface
      const boundedX = Math.max(8, Math.min(window.innerWidth - 80, newX));
      const boundedY = Math.max(8, Math.min(window.innerHeight - 110, newY));

      setPositions((prev) => ({
        ...prev,
        [draggedIconId]: { x: boundedX, y: boundedY },
      }));
    }

    function handleMouseUp() {
      setDraggedIconId(null);
    }

    if (draggedIconId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedIconId]);

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

  const handleIconMouseDown = useCallback(
    (e: React.MouseEvent, appId: string) => {
      e.stopPropagation();
      setDraggedIconId(appId);
      const currentPos = positions[appId] || { x: 12, y: 12 };
      dragOffsetRef.current = {
        x: e.clientX - currentPos.x,
        y: e.clientY - currentPos.y,
      };
    },
    [positions]
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleDesktopClick = useCallback(() => {
    closeContextMenu();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [closeContextMenu]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const arrangeIcons = useCallback(() => {
    setPositions((prev) => {
      const updated = { ...prev };
      APP_REGISTRY.forEach((app, index) => {
        updated[app.id] = {
          x: 12,
          y: 12 + index * 80,
        };
      });
      return updated;
    });
  }, []);

  const changeWallpaper = useCallback((color: string) => {
    setWallpaperColor(color);
    setContextMenu(null);
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col select-none"
      style={{ background: wallpaperColor }}
    >
      {/* ===== DESKTOP SURFACE ===== */}
      <div
        className="flex-1 relative"
        onClick={handleDesktopClick}
        onContextMenu={handleContextMenu}
        style={{ paddingBottom: "30px" }} // space for taskbar
      >
        {/* Desktop Icons */}
        {APP_REGISTRY.map((app) => (
          <DesktopIcon
            key={app.id}
            app={app}
            position={positions[app.id] || { x: 12, y: 12 }}
            onDoubleClick={wm.openWindow}
            onMouseDown={handleIconMouseDown}
          />
        ))}

        {/* ===== CONTEXT MENU ===== */}
        {contextMenu && (
          <div
            className="absolute z-[9999] w-[160px] bg-[#C0C0C0] win2k-raised text-black flex flex-col p-[2px] animate-win2k-fadeIn select-none"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="win2k-menu-item"
              onClick={() => {
                arrangeIcons();
                closeContextMenu();
              }}
            >
              <span>Organizar Iconos</span>
            </div>
            <div
              className="win2k-menu-item"
              onClick={() => {
                handleDesktopClick();
              }}
            >
              <span>Actualizar</span>
            </div>
            <div className="win2k-separator" />
            <div className="px-2 py-1 text-[10px] font-bold text-gray-600">
              Color de Fondo:
            </div>
            {[
              { name: "Azul Clásico", value: "#3A6EA5" },
              { name: "Verde Win98", value: "#008080" },
              { name: "Gris Carbón", value: "#404040" },
              { name: "Azul Oscuro", value: "#1F4E79" },
              { name: "Rojo Retro", value: "#800000" },
            ].map((col) => (
              <div
                key={col.value}
                className="win2k-menu-item flex items-center justify-between"
                onClick={() => changeWallpaper(col.value)}
              >
                <span className={wallpaperColor === col.value ? "font-bold" : ""}>
                  {col.name}
                </span>
                <span
                  className="w-[12px] h-[12px] border border-gray-600"
                  style={{ backgroundColor: col.value }}
                />
              </div>
            ))}
          </div>
        )}

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
              onUpdateBounds={wm.updateWindowBounds}
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
