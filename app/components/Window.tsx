"use client";

import { useCallback, useRef, useEffect, type ReactNode } from "react";
import type { WindowState } from "@/app/types";
import { getAppById } from "@/app/config/apps";

interface WindowProps {
  windowState: WindowState;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onToggleMaximize: (id: string) => void;
  onBringToFront: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  children: ReactNode;
}

/**
 * Floating window component styled like Windows 2000.
 * Features: drag by title bar, minimize, maximize, close, z-index management.
 */
export default function Window({
  windowState,
  isActive,
  onClose,
  onMinimize,
  onToggleMaximize,
  onBringToFront,
  onUpdatePosition,
  children,
}: WindowProps) {
  const dragRef = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const windowRef = useRef<HTMLDivElement>(null);
  const app = getAppById(windowState.appId);

  // Handle drag start on title bar
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (windowState.isMaximized) return;
      e.preventDefault();
      onBringToFront(windowState.id);

      dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: windowState.position.x,
        startPosY: windowState.position.y,
      };
    },
    [windowState.id, windowState.position, windowState.isMaximized, onBringToFront]
  );

  // Global mouse move/up handlers for drag
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!dragRef.current?.isDragging) return;

      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      onUpdatePosition(windowState.id, {
        x: dragRef.current.startPosX + dx,
        y: Math.max(0, dragRef.current.startPosY + dy), // prevent dragging above screen
      });
    }

    function handleMouseUp() {
      if (dragRef.current) {
        dragRef.current.isDragging = false;
        dragRef.current = null;
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [windowState.id, onUpdatePosition]);

  // Don't render if minimized
  if (windowState.isMinimized) return null;

  const IconComponent = app?.icon;

  // Title bar gradient: active = blue gradient, inactive = gray
  const titleBarStyle = isActive
    ? { background: "linear-gradient(to right, #0A246A, #A6CAF0)" }
    : { background: "linear-gradient(to right, #808080, #B4B4B4)" };

  return (
    <div
      ref={windowRef}
      className="absolute animate-win2k-fadeIn"
      style={{
        left: windowState.position.x,
        top: windowState.position.y,
        width: windowState.dimensions.width,
        height: windowState.dimensions.height,
        zIndex: windowState.zIndex,
      }}
      onMouseDown={() => onBringToFront(windowState.id)}
    >
      {/* Outer border (raised 3D) */}
      <div
        className="win2k-raised flex flex-col h-full"
        style={{ background: "#C0C0C0" }}
      >
        {/* ===== TITLE BAR ===== */}
        <div
          className="flex items-center h-[18px] px-[3px] gap-1 shrink-0 select-none"
          style={titleBarStyle}
          onMouseDown={handleMouseDown}
          onDoubleClick={() => onToggleMaximize(windowState.id)}
        >
          {/* App Icon (16px) */}
          {IconComponent && (
            <IconComponent size={14} color="#FFFFFF" strokeWidth={2} />
          )}

          {/* Window Title */}
          <span className="flex-1 text-[11px] font-bold text-white truncate leading-none">
            {app?.name ?? "Window"}
          </span>

          {/* Window Control Buttons */}
          <div className="flex gap-[2px]">
            {/* Minimize */}
            <button
              className="win2k-title-button"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize(windowState.id);
              }}
              aria-label="Minimize"
            >
              <svg width="6" height="2" viewBox="0 0 6 2">
                <rect width="6" height="2" fill="black" />
              </svg>
            </button>

            {/* Maximize / Restore */}
            <button
              className="win2k-title-button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMaximize(windowState.id);
              }}
              aria-label={windowState.isMaximized ? "Restore" : "Maximize"}
            >
              {windowState.isMaximized ? (
                // Restore icon (two overlapping squares)
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <rect x="2" y="0" width="6" height="6" fill="none" stroke="black" strokeWidth="1" />
                  <rect x="0" y="2" width="6" height="6" fill="#C0C0C0" stroke="black" strokeWidth="1" />
                </svg>
              ) : (
                // Maximize icon (single square)
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <rect x="0" y="0" width="8" height="8" fill="none" stroke="black" strokeWidth="1" />
                  <line x1="0" y1="1" x2="8" y2="1" stroke="black" strokeWidth="1" />
                </svg>
              )}
            </button>

            {/* Close */}
            <button
              className="win2k-title-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose(windowState.id);
              }}
              aria-label="Close"
            >
              <svg width="8" height="7" viewBox="0 0 8 7">
                <line x1="0" y1="0" x2="8" y2="7" stroke="black" strokeWidth="1.5" />
                <line x1="8" y1="0" x2="0" y2="7" stroke="black" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* ===== MENU BAR (optional faux) ===== */}
        <div
          className="flex items-center h-[20px] px-1 gap-3 shrink-0 text-[11px] select-none"
          style={{ background: "#C0C0C0" }}
        >
          <span className="hover:underline cursor-default">File</span>
          <span className="hover:underline cursor-default">Edit</span>
          <span className="hover:underline cursor-default">View</span>
          <span className="hover:underline cursor-default">Help</span>
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className="flex-1 mx-[2px] mb-[2px] win2k-sunken overflow-auto">
          <div
            className="h-full overflow-auto"
            style={{ background: "#FFFFFF" }}
          >
            {children}
          </div>
        </div>

        {/* ===== STATUS BAR ===== */}
        <div
          className="flex items-center h-[18px] px-1 shrink-0"
          style={{ background: "#C0C0C0" }}
        >
          <div className="win2k-sunken-thin flex-1 h-[14px] px-1 flex items-center">
            <span className="text-[10px] text-[#000000] truncate">
              {app?.description ?? "Ready"}
            </span>
          </div>
          <div className="win2k-sunken-thin h-[14px] px-2 ml-1 flex items-center">
            <span className="text-[10px] text-[#000000]">
              {app?.status === "completed" ? "✅" : "🚧"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
