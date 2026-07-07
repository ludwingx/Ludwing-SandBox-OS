import {
  Gamepad2,
  ShoppingCart,
  Brain,
  Bot,
  Ticket,
  Sparkles,
} from "lucide-react";
import type { AppDefinition } from "@/app/types";

/** Registry of all available applications in the Sandbox OS */
export const APP_REGISTRY: AppDefinition[] = [
  {
    id: "lamovidabo",
    name: "LaMovidaBO",
    description: "Galería de Artistas Pixel Art",
    icon: Gamepad2,
    accentColor: "#E040FB",
    status: "development",
  },
  {
    id: "marketgs",
    name: "Market GS",
    description: "ERP de Inventario",
    icon: ShoppingCart,
    accentColor: "#4CAF50",
    status: "completed",
  },
  {
    id: "maryjaneai",
    name: "Mary Jane AI",
    description: "Copiloto de Requerimientos con IA",
    icon: Brain,
    accentColor: "#FF9800",
    status: "completed",
  },
  {
    id: "phronagents",
    name: "PhronAgents",
    description: "Hub de Agentes Conversacionales",
    icon: Bot,
    accentColor: "#2196F3",
    status: "completed",
  },
  {
    id: "astroboyxl",
    name: "Astroboy XL",
    description: "Listening Party Tickets",
    icon: Ticket,
    accentColor: "#ea2812",
    status: "completed",
  },
  {
    id: "scentduo",
    name: "ScentDuo",
    description: "Boutique de Perfumes y Decants",
    icon: Sparkles,
    accentColor: "#D4AF37",
    status: "completed",
  },
];

/** Find an app definition by its ID */
export function getAppById(id: string): AppDefinition | undefined {
  return APP_REGISTRY.find((app) => app.id === id);
}

/** Status labels for display */
export const STATUS_LABELS: Record<string, string> = {
  development: "🚧 En Desarrollo",
  completed: "✅ Terminado",
};
