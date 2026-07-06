"use client";

import { Brain, Send, User, Bot } from "lucide-react";
import { useState } from "react";

/** Mary Jane AI — Copiloto de Requerimientos con IA (Terminado) */
export default function MaryJaneApp() {
  const [inputValue, setInputValue] = useState("");

  const mockConversation = [
    {
      role: "assistant" as const,
      message:
        "¡Hola! Soy Mary Jane AI, tu copiloto de requerimientos. ¿En qué proyecto estamos trabajando hoy?",
    },
    {
      role: "user" as const,
      message:
        "Necesito documentar los requerimientos para un sistema de gestión de inventario con control de stock mínimo.",
    },
    {
      role: "assistant" as const,
      message:
        "Perfecto. He identificado 3 módulos clave para tu sistema:\n\n📦 **Módulo de Productos** — CRUD completo con categorías y SKU.\n📊 **Control de Stock** — Alertas automáticas al alcanzar mínimos.\n📋 **Reportes** — Dashboard con métricas de rotación.\n\n¿Quieres que genere las historias de usuario para el primer módulo?",
    },
    {
      role: "user" as const,
      message: "Sí, genera las historias de usuario del módulo de productos.",
    },
    {
      role: "assistant" as const,
      message:
        "📝 **Historias de Usuario — Módulo de Productos:**\n\n1. Como administrador, quiero registrar productos con nombre, SKU, precio y categoría para mantener un catálogo organizado.\n\n2. Como vendedor, quiero buscar productos por nombre o SKU para encontrar rápidamente lo que necesito.\n\n3. Como administrador, quiero editar la información de un producto existente para mantener los datos actualizados.\n\n¿Quieres que agregue criterios de aceptación a cada historia?",
    },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: "Tahoma, sans-serif", fontSize: "12px" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 p-2 shrink-0"
        style={{ background: "#ECE9D8", borderBottom: "1px solid #808080" }}
      >
        <Brain size={18} color="#FF9800" />
        <span className="font-bold text-[13px]">Mary Jane AI</span>
        <span className="text-[10px] text-[#808080] ml-1">
          Copiloto de Requerimientos
        </span>
        <div
          className="ml-auto px-2 py-[2px] text-[10px] font-bold text-white"
          style={{ background: "#FF9800" }}
        >
          ✅ PRODUCCIÓN
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto p-3 flex flex-col gap-3" style={{ background: "#FFFFFF" }}>
        {mockConversation.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className="w-[28px] h-[28px] win2k-raised flex items-center justify-center shrink-0"
              style={{
                background:
                  msg.role === "assistant" ? "#FFF3E0" : "#E3F2FD",
              }}
            >
              {msg.role === "assistant" ? (
                <Bot size={16} color="#FF9800" />
              ) : (
                <User size={16} color="#2196F3" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] p-2 text-[11px] leading-[1.5] ${
                msg.role === "user"
                  ? "win2k-raised"
                  : "win2k-sunken"
              }`}
              style={{
                background:
                  msg.role === "user" ? "#E3F2FD" : "#FFFFFF",
                whiteSpace: "pre-line",
              }}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div
        className="flex items-center gap-1 p-1 shrink-0"
        style={{ background: "#ECE9D8", borderTop: "1px solid #808080" }}
      >
        <div className="flex-1 win2k-sunken">
          <input
            type="text"
            className="w-full px-2 py-1 text-[11px] outline-none border-none bg-white"
            placeholder="Escribe tu requerimiento..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button className="win2k-button flex items-center gap-1 px-3">
          <Send size={12} />
          <span>Enviar</span>
        </button>
      </div>
    </div>
  );
}
