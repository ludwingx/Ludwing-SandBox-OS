import type { LucideIcon } from "lucide-react";

/** Status of an application */
export type AppStatus = "development" | "completed";

/** Definition of an application that can be opened in the OS */
export interface AppDefinition {
  /** Unique slug identifier (used in query params) */
  id: string;
  /** Display name */
  name: string;
  /** Short description */
  description: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Accent color for the app */
  accentColor: string;
  /** Development status */
  status: AppStatus;
}

/** Position of a window on the desktop */
export interface WindowPosition {
  x: number;
  y: number;
}

/** Dimensions of a window */
export interface WindowDimensions {
  width: number;
  height: number;
}

/** State of a single floating window */
export interface WindowState {
  /** Unique window instance ID */
  id: string;
  /** App ID that this window belongs to */
  appId: string;
  /** Current position */
  position: WindowPosition;
  /** Current dimensions */
  dimensions: WindowDimensions;
  /** Whether the window is maximized */
  isMaximized: boolean;
  /** Whether the window is minimized (hidden, shown in taskbar) */
  isMinimized: boolean;
  /** Z-index for stacking order */
  zIndex: number;
  /** Position/dimensions before maximizing (to restore) */
  preMaximizeState?: {
    position: WindowPosition;
    dimensions: WindowDimensions;
  };
}

/** Actions available for window management */
export interface WindowManagerActions {
  openWindow: (appId: string) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  toggleMaximize: (windowId: string) => void;
  bringToFront: (windowId: string) => void;
  updatePosition: (windowId: string, position: WindowPosition) => void;
  updateWindowBounds: (windowId: string, position: WindowPosition, dimensions: WindowDimensions) => void;
}

/** Complete window manager state + actions */
export interface WindowManager extends WindowManagerActions {
  windows: WindowState[];
  activeWindowId: string | null;
}
