"use client";

import { Bot, MessageSquare, Zap, Settings, Play } from "lucide-react";

/** PhronAgents — Hub de Agentes Conversacionales (Terminado) */
export default function PhronAgentsApp() {
  const mockAgents = [
    {
      name: "Agente de Soporte",
      description: "Atiende consultas de clientes 24/7 con respuestas contextualizadas.",
      status: "active",
      conversations: 1_247,
      model: "GPT-4o",
      emoji: "🎧",
    },
    {
      name: "Agente de Ventas",
      description: "Guía al cliente en el proceso de compra y recomienda productos.",
      status: "active",
      conversations: 856,
      model: "GPT-4o-mini",
      emoji: "💼",
    },
    {
      name: "Agente de Onboarding",
      description: "Acompaña a nuevos usuarios en la configuración inicial del sistema.",
      status: "paused",
      conversations: 312,
      model: "Claude 3.5",
      emoji: "🚀",
    },
    {
      name: "Agente de FAQ",
      description: "Responde preguntas frecuentes basándose en la base de conocimiento.",
      status: "active",
      conversations: 2_103,
      model: "GPT-4o-mini",
      emoji: "📚",
    },
  ];

  return (
    <div className="p-4" style={{ fontFamily: "Tahoma, sans-serif", fontSize: "12px" }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Bot size={20} color="#2196F3" />
        <h1 className="text-[16px] font-bold m-0">PhronAgents Hub</h1>
        <div
          className="ml-auto px-2 py-[2px] text-[10px] font-bold text-white"
          style={{ background: "#2196F3" }}
        >
          ✅ PRODUCCIÓN
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 win2k-raised p-2" style={{ background: "#ECE9D8" }}>
          <div className="flex items-center gap-1 mb-1">
            <Bot size={14} color="#2196F3" />
            <span className="text-[10px] text-[#808080]">Agentes</span>
          </div>
          <div className="text-[14px] font-bold">4</div>
        </div>
        <div className="flex-1 win2k-raised p-2" style={{ background: "#ECE9D8" }}>
          <div className="flex items-center gap-1 mb-1">
            <MessageSquare size={14} color="#4CAF50" />
            <span className="text-[10px] text-[#808080]">Conversaciones</span>
          </div>
          <div className="text-[14px] font-bold">4,518</div>
        </div>
        <div className="flex-1 win2k-raised p-2" style={{ background: "#ECE9D8" }}>
          <div className="flex items-center gap-1 mb-1">
            <Zap size={14} color="#FF9800" />
            <span className="text-[10px] text-[#808080]">Activos</span>
          </div>
          <div className="text-[14px] font-bold">3</div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="flex flex-col gap-2">
        {mockAgents.map((agent) => (
          <div
            key={agent.name}
            className="win2k-raised p-2 flex items-start gap-3"
            style={{ background: "#ECE9D8" }}
          >
            {/* Avatar */}
            <div
              className="w-[36px] h-[36px] win2k-sunken flex items-center justify-center shrink-0 text-[20px]"
              style={{ background: "#FFFFFF" }}
            >
              {agent.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[12px]">{agent.name}</span>
                <span
                  className="px-1 text-[9px] text-white"
                  style={{
                    background:
                      agent.status === "active" ? "#4CAF50" : "#808080",
                  }}
                >
                  {agent.status === "active" ? "● Activo" : "⏸ Pausado"}
                </span>
              </div>
              <p className="text-[10px] text-[#404040] mt-[2px] m-0">
                {agent.description}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[10px] text-[#808080]">
                <span>📊 {agent.conversations.toLocaleString()} chats</span>
                <span>🤖 {agent.model}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 shrink-0">
              <button className="win2k-button" title="Configurar">
                <Settings size={12} />
              </button>
              <button className="win2k-button" title="Iniciar">
                <Play size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
