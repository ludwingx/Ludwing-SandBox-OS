"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  User,
  FolderOpen,
  FileText,
  Globe,
  Briefcase,
  Wrench,
  Power,
  ChevronRight,
} from "lucide-react";
import { APP_REGISTRY } from "@/app/config/apps";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

/** Skills list for the start menu */
const SKILLS = [
  "TypeScript",
  "React / Next.js",
  "Node.js",
  "Python",
  "PostgreSQL",
  "n8n",
  "Docker",
  "Tailwind CSS",
  "AI / LLMs",
];

/**
 * Windows 2000 Start Menu.
 * Features a blue side banner with profile, app list, external links, and skills.
 */
export default function StartMenu({ isOpen, onClose, onOpenApp }: StartMenuProps) {
  const [showAppsSubmenu, setShowAppsSubmenu] = useState(false);
  const [showSkillsSubmenu, setShowSkillsSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleAppClick = useCallback(
    (appId: string) => {
      onOpenApp(appId);
      onClose();
    },
    [onOpenApp, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute bottom-[30px] left-0 flex animate-win2k-slideUp"
      style={{
        zIndex: 10000,
        boxShadow: "2px -2px 4px rgba(0,0,0,0.3)",
      }}
    >
      {/* Main Menu Container */}
      <div className="win2k-raised flex" style={{ background: "#C0C0C0" }}>
        {/* ===== BLUE SIDE BANNER ===== */}
        <div
          className="w-[24px] flex items-end justify-center pb-2"
          style={{
            background: "linear-gradient(to top, #0A246A, #A6CAF0)",
          }}
        >
          <span
            className="text-white text-[11px] font-bold whitespace-nowrap"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              letterSpacing: "1px",
            }}
          >
            Ludwing<span className="font-normal opacity-70">Sandbox</span>
          </span>
        </div>

        {/* ===== MENU ITEMS ===== */}
        <div className="flex flex-col py-1 min-w-[200px]">
          {/* Profile header */}
          <div className="flex items-center gap-2 px-2 py-2 mb-1">
            <div
              className="w-[40px] h-[40px] win2k-sunken flex items-center justify-center"
              style={{ background: "#FFFFFF" }}
            >
              <User size={28} color="#0A246A" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[12px]">Ludwing</span>
              <span className="text-[10px] text-[#808080]">Full Stack Developer</span>
            </div>
          </div>

          <div className="win2k-separator" />

          {/* Programs / My Apps */}
          <div
            className="win2k-menu-item relative"
            onMouseEnter={() => setShowAppsSubmenu(true)}
            onMouseLeave={() => setShowAppsSubmenu(false)}
          >
            <FolderOpen size={16} strokeWidth={1.5} />
            <span className="flex-1">Mis Proyectos</span>
            <ChevronRight size={12} />

            {/* Apps Submenu */}
            {showAppsSubmenu && (
              <div
                className="absolute left-full top-0 win2k-raised py-1 min-w-[180px] animate-win2k-fadeIn"
                style={{ background: "#C0C0C0", zIndex: 10001 }}
              >
                {APP_REGISTRY.map((app) => {
                  const AppIcon = app.icon;
                  return (
                    <div
                      key={app.id}
                      className="win2k-menu-item"
                      onClick={() => handleAppClick(app.id)}
                    >
                      <AppIcon size={16} strokeWidth={1.5} />
                      <span>{app.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="win2k-separator" />

          {/* External Links */}
          <a
            href="https://github.com/ludwingx"
            target="_blank"
            rel="noopener noreferrer"
            className="win2k-menu-item no-underline"
          >
            <Globe size={16} strokeWidth={1.5} />
            <span>GitHub</span>
          </a>

          <a
            href="https://linkedin.com/in/ludwingx"
            target="_blank"
            rel="noopener noreferrer"
            className="win2k-menu-item no-underline"
          >
            <Briefcase size={16} strokeWidth={1.5} />
            <span>LinkedIn</span>
          </a>

          <a
            href="#"
            className="win2k-menu-item no-underline"
          >
            <FileText size={16} strokeWidth={1.5} />
            <span>Mi CV</span>
          </a>

          <div className="win2k-separator" />

          {/* Skills */}
          <div
            className="win2k-menu-item relative"
            onMouseEnter={() => setShowSkillsSubmenu(true)}
            onMouseLeave={() => setShowSkillsSubmenu(false)}
          >
            <Wrench size={16} strokeWidth={1.5} />
            <span className="flex-1">Habilidades</span>
            <ChevronRight size={12} />

            {showSkillsSubmenu && (
              <div
                className="absolute left-full top-0 win2k-raised py-1 min-w-[160px] animate-win2k-fadeIn"
                style={{ background: "#C0C0C0", zIndex: 10001 }}
              >
                {SKILLS.map((skill) => (
                  <div key={skill} className="win2k-menu-item cursor-default">
                    <span className="text-[10px]">●</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="win2k-separator" />

          {/* Shut Down */}
          <div
            className="win2k-menu-item"
            onClick={onClose}
          >
            <Power size={16} strokeWidth={1.5} />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </div>
    </div>
  );
}
