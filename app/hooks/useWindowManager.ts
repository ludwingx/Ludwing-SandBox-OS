"use client";

import { useState, useCallback } from "react";
import type { WindowState, WindowPosition, WindowManager } from "@/app/types";

/** Default window dimensions */
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 480;

/** Offset for each new window to cascade */
const CASCADE_OFFSET = 30;

/** Generate a unique window ID */
function generateWindowId(): string {
  return `win-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Central hook for managing floating windows in the OS.
 * Handles opening, closing, minimizing, maximizing, z-index, and positioning.
 */
export function useWindowManager(): WindowManager {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  const getNextZIndex = useCallback(() => {
    setNextZIndex((prev) => prev + 1);
    return nextZIndex + 1;
  }, [nextZIndex]);

  /** Open a new window for the given app. If already open, bring it to front. */
  const openWindow = useCallback(
    (appId: string) => {
      setWindows((prev) => {
        // Check if this app already has a window open
        const existing = prev.find((w) => w.appId === appId);
        if (existing) {
          // If minimized, restore it; otherwise, bring to front
          const newZ = nextZIndex + 1;
          setNextZIndex(newZ);
          setActiveWindowId(existing.id);
          return prev.map((w) =>
            w.id === existing.id
              ? { ...w, isMinimized: false, zIndex: newZ }
              : w
          );
        }

        // Calculate cascade position
        const openCount = prev.length;
        const cascadeX = 100 + (openCount % 8) * CASCADE_OFFSET;
        const cascadeY = 60 + (openCount % 8) * CASCADE_OFFSET;

        const newZ = nextZIndex + 1;
        setNextZIndex(newZ);

        const newWindow: WindowState = {
          id: generateWindowId(),
          appId,
          position: { x: cascadeX, y: cascadeY },
          dimensions: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
          isMaximized: false,
          isMinimized: false,
          zIndex: newZ,
        };

        setActiveWindowId(newWindow.id);
        return [...prev, newWindow];
      });
    },
    [nextZIndex]
  );

  /** Close and remove a window */
  const closeWindow = useCallback(
    (windowId: string) => {
      setWindows((prev) => prev.filter((w) => w.id !== windowId));
      setActiveWindowId((prev) => (prev === windowId ? null : prev));
    },
    []
  );

  /** Minimize a window (hide it, show in taskbar) */
  const minimizeWindow = useCallback(
    (windowId: string) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, isMinimized: true } : w))
      );
      setActiveWindowId((prev) => (prev === windowId ? null : prev));
    },
    []
  );

  /** Restore a minimized window */
  const restoreWindow = useCallback(
    (windowId: string) => {
      const newZ = getNextZIndex();
      setWindows((prev) =>
        prev.map((w) =>
          w.id === windowId
            ? { ...w, isMinimized: false, zIndex: newZ }
            : w
        )
      );
      setActiveWindowId(windowId);
    },
    [getNextZIndex]
  );

  /** Toggle maximize/restore for a window */
  const toggleMaximize = useCallback(
    (windowId: string) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== windowId) return w;
          if (w.isMaximized) {
            // Restore to pre-maximize state
            return {
              ...w,
              isMaximized: false,
              position: w.preMaximizeState?.position ?? w.position,
              dimensions: w.preMaximizeState?.dimensions ?? w.dimensions,
              preMaximizeState: undefined,
            };
          } else {
            // Maximize: save current state, go fullscreen (minus taskbar)
            return {
              ...w,
              isMaximized: true,
              preMaximizeState: {
                position: w.position,
                dimensions: w.dimensions,
              },
              position: { x: 0, y: 0 },
              dimensions: {
                width: window.innerWidth,
                height: window.innerHeight - 30, // taskbar height
              },
            };
          }
        })
      );
    },
    []
  );

  /** Bring a window to the front (highest z-index) */
  const bringToFront = useCallback(
    (windowId: string) => {
      const newZ = getNextZIndex();
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, zIndex: newZ } : w))
      );
      setActiveWindowId(windowId);
    },
    [getNextZIndex]
  );

  /** Update window position (during drag) */
  const updatePosition = useCallback(
    (windowId: string, position: WindowPosition) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, position } : w))
      );
    },
    []
  );

  /** Update window position and dimensions (during resize) */
  const updateWindowBounds = useCallback(
    (windowId: string, position: WindowPosition, dimensions: { width: number; height: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === windowId ? { ...w, position, dimensions } : w))
      );
    },
    []
  );

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    bringToFront,
    updatePosition,
    updateWindowBounds,
  };
}
