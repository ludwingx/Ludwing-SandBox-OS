"use client";

import { useCallback, useRef, useEffect, useState, type ReactNode } from "react";
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
  onUpdateBounds: (
    id: string,
    position: { x: number; y: number },
    dimensions: { width: number; height: number }
  ) => void;
  children: ReactNode;
}

/**
 * Floating window component styled like Windows 2000.
 * Features: drag by title bar, resize, minimize, maximize, close, z-index management.
 */
export default function Window({
  windowState,
  isActive,
  onClose,
  onMinimize,
  onToggleMaximize,
  onBringToFront,
  onUpdatePosition,
  onUpdateBounds,
  children,
}: WindowProps) {
  const [zoom, setZoom] = useState(1.0);
  const dragRef = useRef<{
    isDragging: boolean;
    isResizing?: boolean;
    resizeDir?: "e" | "s" | "se" | "w" | "sw";
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    startWidth?: number;
    startHeight?: number;
    currentX?: number;
    currentY?: number;
    currentWidth?: number;
    currentHeight?: number;
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
        currentX: windowState.position.x,
        currentY: windowState.position.y,
      };
    },
    [windowState.id, windowState.position, windowState.isMaximized, onBringToFront]
  );

  // Handle resize start on edges or corners
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: "e" | "s" | "se" | "w" | "sw" | "n" | "ne" | "nw") => {
      if (windowState.isMaximized) return;
      e.preventDefault();
      e.stopPropagation();
      onBringToFront(windowState.id);

      dragRef.current = {
        isDragging: false,
        isResizing: true,
        resizeDir: direction,
        startX: e.clientX,
        startY: e.clientY,
        startPosX: windowState.position.x,
        startPosY: windowState.position.y,
        startWidth: windowState.dimensions.width,
        startHeight: windowState.dimensions.height,
        currentX: windowState.position.x,
        currentY: windowState.position.y,
        currentWidth: windowState.dimensions.width,
        currentHeight: windowState.dimensions.height,
      };
    },
    [windowState.id, windowState.position, windowState.dimensions, windowState.isMaximized, onBringToFront]
  );

  // Global mouse move/up handlers for drag and resize
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!dragRef.current) return;
      if (!windowRef.current) return;

      if (dragRef.current.isDragging) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        const newX = dragRef.current.startPosX + dx;
        const newY = Math.max(0, dragRef.current.startPosY + dy); // prevent dragging above screen

        // Direct DOM update (no React re-renders)
        windowRef.current.style.left = `${newX}px`;
        windowRef.current.style.top = `${newY}px`;

        dragRef.current.currentX = newX;
        dragRef.current.currentY = newY;
      } else if (dragRef.current.isResizing) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;

        const startWidth = dragRef.current.startWidth || 640;
        const startHeight = dragRef.current.startHeight || 480;
        const direction = dragRef.current.resizeDir;

        const minWidth = 250;
        const minHeight = 150;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = dragRef.current.startPosX;
        let newY = dragRef.current.startPosY;

        // Horizontal sizing (E / W)
        if (direction === "e" || direction === "se" || direction === "ne") {
          newWidth = Math.max(minWidth, startWidth + dx);
        } else if (direction === "w" || direction === "sw" || direction === "nw") {
          const calculatedWidth = startWidth - dx;
          if (calculatedWidth >= minWidth) {
            newWidth = calculatedWidth;
            newX = dragRef.current.startPosX + dx;
          }
        }

        // Vertical sizing (S / N)
        if (direction === "s" || direction === "se" || direction === "sw") {
          newHeight = Math.max(minHeight, startHeight + dy);
        } else if (direction === "n" || direction === "ne" || direction === "nw") {
          const calculatedHeight = startHeight - dy;
          if (calculatedHeight >= minHeight) {
            newHeight = calculatedHeight;
            newY = Math.max(0, dragRef.current.startPosY + dy); // prevent resizing above screen
          }
        }

        // Direct DOM update (no React re-renders)
        windowRef.current.style.left = `${newX}px`;
        windowRef.current.style.top = `${newY}px`;
        windowRef.current.style.width = `${newWidth}px`;
        windowRef.current.style.height = `${newHeight}px`;

        dragRef.current.currentX = newX;
        dragRef.current.currentY = newY;
        dragRef.current.currentWidth = newWidth;
        dragRef.current.currentHeight = newHeight;
      }
    }

    function handleMouseUp() {
      if (dragRef.current) {
        if (dragRef.current.isDragging) {
          const finalX = dragRef.current.currentX !== undefined ? dragRef.current.currentX : dragRef.current.startPosX;
          const finalY = dragRef.current.currentY !== undefined ? dragRef.current.currentY : dragRef.current.startPosY;
          onUpdatePosition(windowState.id, { x: finalX, y: finalY });
        } else if (dragRef.current.isResizing) {
          const finalX = dragRef.current.currentX !== undefined ? dragRef.current.currentX : dragRef.current.startPosX;
          const finalY = dragRef.current.currentY !== undefined ? dragRef.current.currentY : dragRef.current.startPosY;
          const finalWidth = dragRef.current.currentWidth !== undefined ? dragRef.current.currentWidth : (dragRef.current.startWidth || 640);
          const finalHeight = dragRef.current.currentHeight !== undefined ? dragRef.current.currentHeight : (dragRef.current.startHeight || 480);
          onUpdateBounds(windowState.id, { x: finalX, y: finalY }, { width: finalWidth, height: finalHeight });
        }
        dragRef.current = null;
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [windowState.id, onUpdatePosition, onUpdateBounds]);

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
        left: `${windowState.position.x}px`,
        top: `${windowState.position.y}px`,
        width: `${windowState.dimensions.width}px`,
        height: `${windowState.dimensions.height}px`,
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

        {/* ===== MENU BAR ===== */}
        <div
          className="flex items-center justify-between h-[20px] px-1 shrink-0 text-[11px] select-none border-b border-gray-400"
          style={{ background: "#C0C0C0" }}
        >
          <div className="flex gap-3">
            <span className="hover:underline cursor-default">File</span>
            <span className="hover:underline cursor-default">Edit</span>
            <span className="hover:underline cursor-default">View</span>
            <span className="hover:underline cursor-default">Help</span>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1.5 mr-1 font-sans">
            <button
              onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
              className="win2k-button h-[15px] min-h-0 py-0 px-1.5 text-[9px] flex items-center justify-center font-bold"
              style={{ padding: "0 4px", minHeight: "15px" }}
              title="Zoom Out"
            >
              🔍-
            </button>
            <span 
              onClick={() => setZoom(1.0)}
              className="px-1 text-[9px] font-mono hover:bg-black/10 cursor-pointer min-w-[32px] text-center"
              title="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}
              className="win2k-button h-[15px] min-h-0 py-0 px-1.5 text-[9px] flex items-center justify-center font-bold"
              style={{ padding: "0 4px", minHeight: "15px" }}
              title="Zoom In"
            >
              🔍+
            </button>
          </div>
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className="flex-1 mx-[2px] mb-[2px] win2k-sunken overflow-hidden relative">
          <div
            className="overflow-auto modern-scroll"
            style={{
              background: "#FFFFFF",
              width: `${100 / zoom}%`,
              height: `${100 / zoom}%`,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
            }}
          >
            {children}
          </div>
        </div>

        {/* ===== STATUS BAR ===== */}
        <div
          className="flex items-center h-[18px] px-1 shrink-0 relative"
          style={{ background: "#C0C0C0" }}
        >
          <div className="win2k-sunken-thin flex-1 h-[14px] px-1 flex items-center">
            <span className="text-[10px] text-[#000000] truncate">
              {app?.description ?? "Ready"}
            </span>
          </div>
          <div className="win2k-sunken-thin h-[14px] px-2 ml-1 flex items-center mr-[14px]">
            <span className="text-[10px] text-[#000000]">
              {app?.status === "completed" ? "✅" : "🚧"}
            </span>
          </div>

          {/* Classic Win2000 Diagonal Resize Grip */}
          {!windowState.isMaximized && (
            <div
              className="absolute right-0 bottom-0 w-[14px] h-[14px] cursor-nwse-resize flex items-end justify-end p-[1px] select-none z-50"
              onMouseDown={(e) => handleResizeStart(e, "se")}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-70">
                <path d="M6 0 Q10 0 10 0 M3 3 L7 3 M0 6 L4 6 M7 7 L10 7 M4 10 L7 10" stroke="#808080" strokeWidth="1" />
                <path d="M7 1 L10 1 M4 4 L7 4 M1 7 L4 7 M8 8 L10 8 M5 10 L8 10" stroke="#FFFFFF" strokeWidth="1" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Invisible Edge Resize Overlays */}
      {!windowState.isMaximized && (
        <>
          {/* Edges */}
          {/* Top Edge */}
          <div
            className="absolute left-0 -top-[4px] w-full h-[8px] cursor-ns-resize z-[9999]"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          />
          {/* Bottom Edge */}
          <div
            className="absolute left-0 -bottom-[4px] w-full h-[8px] cursor-ns-resize z-[9999]"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          />
          {/* Left Edge */}
          <div
            className="absolute -left-[4px] top-0 w-[8px] h-full cursor-ew-resize z-[9999]"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          />
          {/* Right Edge */}
          <div
            className="absolute -right-[4px] top-0 w-[8px] h-full cursor-ew-resize z-[9999]"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          />

          {/* Corners */}
          {/* Top Left Corner */}
          <div
            className="absolute -left-[4px] -top-[4px] w-[12px] h-[12px] cursor-nwse-resize z-[10000]"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          />
          {/* Top Right Corner */}
          <div
            className="absolute -right-[4px] -top-[4px] w-[12px] h-[12px] cursor-nesw-resize z-[10000]"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          />
          {/* Bottom Left Corner */}
          <div
            className="absolute -left-[4px] -bottom-[4px] w-[12px] h-[12px] cursor-nesw-resize z-[10000]"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          />
          {/* Bottom Right Corner */}
          <div
            className="absolute -right-[4px] -bottom-[4px] w-[12px] h-[12px] cursor-nwse-resize z-[10000]"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          />
        </>
      )}
    </div>
  );
}
