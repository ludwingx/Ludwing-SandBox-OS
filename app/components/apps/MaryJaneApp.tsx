"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  FolderOpen,
  MessageSquare,
  Trash2,
  Sparkles,
  LayoutDashboard,
  Settings,
  Sun,
  Moon,
  PanelLeft,
  PanelRight,
  Edit2,
  Check,
  X,
  FileText,
  HelpCircle,
  RotateCw,
  Brain,
  Play,
  Pause,
  Printer,
  DollarSign,
  ArrowUpRight,
  Send
} from "lucide-react";

// ==========================================
// TYPES & MOCK DATA
// ==========================================
interface Project {
  id: string;
  name: string;
  createdAt: string;
  coverage: number;
}

interface Requirement {
  id: string;
  title: string;
  type: "roles" | "processes" | "business_rules" | "integrations" | "non_functional" | "data_entities";
  content: string;
  priority: "high" | "medium" | "low";
}

interface GapItem {
  id: string;
  question: string;
  reason: string;
  category: string;
  resolved: boolean;
}

interface SuggestedQuestion {
  question: string;
  priority: "high" | "medium" | "low";
  category: string;
}

const INITIAL_PROJECTS: Project[] = [
  { id: "proj-1", name: "Portal de E-Commerce Premium", createdAt: "Hace 10 mins", coverage: 58 },
  { id: "proj-2", name: "Sistema de Logística & Ruteo", createdAt: "Hace 2 días", coverage: 74 },
  { id: "proj-3", name: "App Móvil de Delivery Local", createdAt: "Hace 1 semana", coverage: 35 },
];

const INITIAL_REQUIREMENTS: Requirement[] = [
  {
    id: "req-1",
    title: "Suscripciones Mensuales con Stripe",
    type: "integrations",
    content: "El sistema debe procesar cobros recurrentes de planes a través de Stripe API, almacenando los customer tokens correspondientes de manera segura.",
    priority: "high"
  },
  {
    id: "req-2",
    title: "Latencia de Peticiones en Backend",
    type: "non_functional",
    content: "El tiempo de respuesta del API de catálogo para usuarios anónimos debe ser menor a 150ms mediante caché de Redis.",
    priority: "medium"
  },
  {
    id: "req-3",
    title: "Autorización de Reembolsos Especiales",
    type: "business_rules",
    content: "Solo los administradores con autenticación multifactor activa pueden autorizar reembolsos que excedan los $500 USD.",
    priority: "high"
  },
  {
    id: "req-4",
    title: "Gestor de Inventario de Tiendas",
    type: "roles",
    content: "Definición del rol 'StoreManager' con permisos exclusivos para actualizar stock físico pero sin acceso a métricas globales financieras.",
    priority: "low"
  }
];

const INITIAL_GAPS: GapItem[] = [
  {
    id: "gap-1",
    question: "¿Qué política de prorrateo se aplicará al cancelar suscripciones a mitad del período?",
    reason: "Se definió el flujo de Stripe pero no la regla de negocio para devoluciones parciales.",
    category: "business_rules",
    resolved: false
  },
  {
    id: "gap-2",
    question: "¿Cuál será la estrategia de fallback en caso de indisponibilidad de la API de Stripe?",
    reason: "Es crítico para mantener la transaccionalidad o encolar peticiones pendientes.",
    category: "non_functional",
    resolved: false
  },
  {
    id: "gap-3",
    question: "¿Se almacenarán los logos cargados por los comercios en un CDN privado o público?",
    reason: "Afecta a las políticas de privacidad y a la arquitectura de AWS S3.",
    category: "security",
    resolved: true
  }
];

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    question: "¿Cuántos clientes concurrentes estiman durante las campañas de marketing masivas?",
    priority: "high",
    category: "non_functional"
  },
  {
    question: "¿Se integrará algún sistema ERP local como SAP o Dynamics para inventarios?",
    priority: "medium",
    category: "integrations"
  },
  {
    question: "¿Existen límites semanales en el retiro de comisiones por parte de los vendedores?",
    priority: "low",
    category: "business_rules"
  }
];

export default function MaryJaneApp() {
  // Navigation & Project selection
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>("proj-1");
  const [currentTab, setCurrentTab] = useState<"workspace" | "report">("workspace");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(true);

  // Theme (UI simulation only)
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Project Rename state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Recording Simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcriptLines, setTranscriptLines] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "user", text: "Cliente: Requerimos una plataforma web responsiva de e-commerce." },
    { sender: "ai", text: "Analista: De acuerdo. ¿Qué métodos de pago consideran críticos?" },
    { sender: "user", text: "Cliente: Stripe para tarjetas de crédito y transferencias bancarias locales para depósitos directos." },
    { sender: "ai", text: "Analista: Entendido, ¿se guardarán tarjetas para cobros automáticos posteriores?" },
    { sender: "user", text: "Cliente: Sí, planeamos un modelo de suscripción mensual recurrente." }
  ]);
  const [newChatText, setNewChatText] = useState("");

  // AI Analysis simulation
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Requirements, Gaps & Questions states
  const [requirements, setRequirements] = useState<Requirement[]>(INITIAL_REQUIREMENTS);
  const [gaps, setGaps] = useState<GapItem[]>(INITIAL_GAPS);
  const [activeCopilotTab, setActiveCopilotTab] = useState<"questions" | "gaps" | "reqs">("questions");

  // Pricing / Cost Estimator States
  const [clientType, setClientType] = useState<"STARTUP" | "SME" | "ENTERPRISE">("SME");
  const [urgency, setUrgency] = useState<"NORMAL" | "URGENT" | "FLEXIBLE">("NORMAL");
  const [devHours, setDevHours] = useState(120);
  const [hourlyRate, setHourlyRate] = useState(35);
  const [profitMargin, setProfitMargin] = useState(25);
  const [riskFactor, setRiskFactor] = useState(15);
  const [refineInput, setRefineInput] = useState("");
  const [activeReportTab, setActiveReportTab] = useState<"client" | "internal">("client");

  // Toast State
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Recording Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
        if (recordingSeconds === 4) {
          setTranscriptLines((prev) => [
            ...prev,
            { sender: "user", text: "Cliente: También necesitamos que la carga de páginas sea súper rápida, menos de 2 segundos." }
          ]);
        }
        if (recordingSeconds === 9) {
          setTranscriptLines((prev) => [
            ...prev,
            { sender: "ai", text: "Analista: Perfecto, eso requiere compresión de imágenes en CDN y SSR para SEO." }
          ]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, recordingSeconds]);

  const toggleRecording = () => {
    if (!isRecording) {
      setRecordingSeconds(0);
      setIsRecording(true);
      triggerToast("Grabación iniciada. Hable o escriba en la simulación.");
    } else {
      setIsRecording(false);
      triggerToast("Grabación finalizada. Transcripción lista para análisis.");
    }
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      triggerToast("Nombre del proyecto requerido.");
      return;
    }
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName,
      createdAt: "Ahora mismo",
      coverage: 0
    };
    setProjects([...projects, newProj]);
    setActiveProjectId(newProj.id);
    setNewProjectName("");
    setIsCreateModalOpen(false);
    triggerToast(`Creado: ${newProj.name}`);
  };

  const handleRenameProject = () => {
    if (!editedTitle.trim()) return;
    setProjects(projects.map((p) => (p.id === activeProjectId ? { ...p, name: editedTitle } : p)));
    setIsEditingTitle(false);
    triggerToast("Nombre del proyecto actualizado.");
  };

  const triggerAIAnalysis = () => {
    setIsAnalyzing(true);
    triggerToast("Iniciando análisis semántico de requerimientos...");
    setTimeout(() => {
      setIsAnalyzing(false);
      // Simular incremento en la cobertura
      setProjects(projects.map((p) => (p.id === activeProjectId ? { ...p, coverage: Math.min(p.coverage + 12, 100) } : p)));
      
      // Añadir requerimiento extraído automáticamente
      const newReq: Requirement = {
        id: `req-ext-${Date.now()}`,
        title: "Optimización de Carga CDN",
        type: "non_functional",
        content: "El frontend debe implementar Server-Side Rendering (SSR) y optimización automatizada de assets para mantener la carga inicial bajo 2s.",
        priority: "medium"
      };
      setRequirements([newReq, ...requirements]);
      triggerToast("¡Análisis completado! Cobertura actualizada y requerimiento extraído.");
    }, 2000);
  };

  // Pricing Calculations
  const baseCost = devHours * hourlyRate;
  const profitAmount = baseCost * (profitMargin / 100);
  const riskAmount = baseCost * (riskFactor / 100);
  const subtotal = baseCost + profitAmount + riskAmount;
  
  const clientMultiplier = clientType === "ENTERPRISE" ? 1.2 : clientType === "STARTUP" ? 0.95 : 1.0;
  const urgencyMultiplier = urgency === "URGENT" ? 1.25 : urgency === "FLEXIBLE" ? 0.9 : 1.0;
  const totalCost = subtotal * clientMultiplier * urgencyMultiplier;

  return (
    <div className="w-full h-full min-h-[550px] overflow-hidden bg-[#030609] text-[#dee9f3] flex flex-col font-sans select-none relative">
      
      {/* Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(157,187,221,0.06)_0%,transparent_70%)] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle,rgba(130,46,54,0.04)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-[#822e36] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#ffffff]/10 animate-fade-in">
          <Sparkles size={16} className="text-[#bd9c44] animate-spin" />
          <span className="text-xs font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 h-full overflow-hidden relative z-10">
        
        {/* Left Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-[#030609]/95 border-r border-[#ffffff]/10 flex flex-col h-full shrink-0 z-20">
            {/* Brand Header */}
            <div className="p-4 border-b border-[#ffffff]/10 flex items-center gap-2.5">
              <div className="p-1.5 bg-[#9dbbdd]/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-[#9dbbdd]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-sm tracking-tight truncate text-[#dee9f3]">Mary Jane</h2>
                <p className="text-[10px] text-[#dee9f3]/50 truncate">Workspace Ludwing</p>
              </div>
            </div>

            {/* Modules Section */}
            <div className="px-4 pt-4 pb-2">
              <span className="font-semibold text-[10px] tracking-widest uppercase text-[#dee9f3]/40">Módulos</span>
            </div>
            <div className="px-2 pb-3 border-b border-[#ffffff]/10 flex flex-col gap-1">
              <button
                onClick={() => setCurrentTab("workspace")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  currentTab === "workspace"
                    ? "bg-[#9dbbdd]/15 text-[#9dbbdd] font-bold"
                    : "hover:bg-[#ffffff]/5 text-[#dee9f3]/60 hover:text-[#dee9f3]"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Workspace</span>
              </button>
              <button
                onClick={() => {
                  setCurrentTab("report");
                  setActiveReportTab("internal");
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  currentTab === "report" && activeReportTab === "internal"
                    ? "bg-[#9dbbdd]/15 text-[#9dbbdd] font-bold"
                    : "hover:bg-[#ffffff]/5 text-[#dee9f3]/60 hover:text-[#dee9f3]"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Configuración de Tarifas</span>
              </button>
            </div>

            {/* Projects Header */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <span className="font-semibold text-[10px] tracking-widest uppercase text-[#dee9f3]/40">Sesiones / Proyectos</span>
              <FolderOpen className="h-3.5 w-3.5 text-[#9dbbdd]" />
            </div>

            {/* Add Project Button */}
            <div className="px-3 pb-3 border-b border-[#ffffff]/10">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg bg-[#9dbbdd]/10 border border-[#9dbbdd]/25 hover:bg-[#9dbbdd]/20 text-[#9dbbdd] font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-3.5 w-3.5" /> Crear Proyecto
              </button>
            </div>

            {/* Projects List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    setActiveProjectId(proj.id);
                    triggerToast(`Proyecto: ${proj.name}`);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 group cursor-pointer ${
                    proj.id === activeProjectId
                      ? "bg-[#9dbbdd]/10 border border-[#9dbbdd]/20 text-[#9dbbdd]"
                      : "hover:bg-[#ffffff]/5 border border-transparent text-[#dee9f3]/60"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate flex-1">{proj.name}</span>
                  {projects.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjects(projects.filter((p) => p.id !== proj.id));
                        if (activeProjectId === proj.id) {
                          setActiveProjectId(projects.find((p) => p.id !== proj.id)?.id || "");
                        }
                        triggerToast("Proyecto eliminado");
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-[#822e36]"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-[#ffffff]/10 flex flex-col gap-1.5">
              <div className="px-3 py-1 flex justify-between items-center text-[9px] font-mono text-[#dee9f3]/30">
                <span>MARYJANE AI</span>
                <span>V1.0</span>
              </div>
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  triggerToast(`Modo ${theme === "dark" ? "claro" : "oscuro"} activado`);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs hover:bg-[#ffffff]/5 text-[#dee9f3]/60 hover:text-[#dee9f3]"
              >
                {theme === "dark" ? <Sun className="h-3.5 w-3.5 text-[#bd9c44]" /> : <Moon className="h-3.5 w-3.5 text-[#9dbbdd]" />}
                <span>Modo {theme === "dark" ? "Claro" : "Oscuro"}</span>
              </button>
            </div>
          </aside>
        )}

        {/* Main Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Header */}
          <header className="p-3 sm:p-4 border-b border-[#ffffff]/10 flex flex-col lg:flex-row gap-3 lg:gap-0 lg:items-center justify-between bg-[#030609]/50 backdrop-blur-md z-10 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Sidebar toggle */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="h-8 w-8 hover:bg-[#ffffff]/5 rounded-lg flex items-center justify-center shrink-0 text-[#dee9f3]/80"
                  title="Toggle Sidebar"
                >
                  <PanelLeft className={`h-4 w-4 ${sidebarOpen ? "text-[#dee9f3]/50" : "text-[#9dbbdd]"}`} />
                </button>

                <div className="p-1.5 bg-[#9dbbdd]/10 rounded-lg text-[#9dbbdd] shrink-0">
                  <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                </div>

                {isEditingTitle ? (
                  <div className="flex items-center gap-1 min-w-0">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="text-sm font-bold bg-[#030609] border border-[#ffffff]/10 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#9dbbdd] w-full max-w-[200px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameProject();
                        if (e.key === "Escape") setIsEditingTitle(false);
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleRenameProject}
                      className="h-7 w-7 rounded flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsEditingTitle(false)}
                      className="h-7 w-7 rounded flex items-center justify-center text-red-500 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <h1 className="font-bold text-sm tracking-tight flex items-center gap-1.5 group cursor-pointer" onClick={() => {
                      setEditedTitle(activeProject.name);
                      setIsEditingTitle(true);
                    }}>
                      <span className="truncate max-w-[180px] block">{activeProject.name}</span>
                      <Edit2 className="h-3 w-3 text-[#dee9f3]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h1>
                    <p className="text-[10px] text-[#dee9f3]/40 hidden xs:block">
                      Workspace de Relevamiento Inteligente
                    </p>
                  </div>
                )}
              </div>

              {/* Tabs Section */}
              <div className="flex bg-[#ffffff]/5 p-1 rounded-lg border border-[#ffffff]/10 w-full sm:w-auto sm:ml-2 shrink-0">
                <button
                  onClick={() => setCurrentTab("workspace")}
                  className={`text-xs h-7 px-3.5 font-semibold rounded-md flex-1 sm:flex-initial transition-all ${
                    currentTab === "workspace" ? "bg-[#9dbbdd]/15 text-[#9dbbdd]" : "text-[#dee9f3]/60 hover:text-[#dee9f3]"
                  }`}
                >
                  Relevamiento
                </button>
                <button
                  onClick={() => {
                    setCurrentTab("report");
                    setActiveReportTab("client");
                  }}
                  className={`text-xs h-7 px-3.5 font-semibold rounded-md gap-1.5 flex items-center justify-center flex-1 sm:flex-initial transition-all ${
                    currentTab === "report" && activeReportTab === "client" ? "bg-[#9dbbdd]/15 text-[#9dbbdd]" : "text-[#dee9f3]/60 hover:text-[#dee9f3]"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Informe & Cotización</span>
                </button>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center justify-end gap-2 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-[#ffffff]/5 border border-[#ffffff]/10">
                ES-ES
              </span>

              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center gap-1.5 h-8 text-xs px-3 rounded-lg border border-[#ffffff]/10 bg-[#ffffff]/5 hover:bg-[#ffffff]/10 text-[#dee9f3]"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Tips</span>
              </button>

              <button
                onClick={triggerAIAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 h-8 text-xs px-3 rounded-lg border border-[#9dbbdd]/20 bg-[#9dbbdd]/10 hover:bg-[#9dbbdd]/20 text-[#9dbbdd] font-semibold disabled:opacity-40"
              >
                <RotateCw className={`h-3.5 w-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                <span>Analizar</span>
              </button>

              <button
                onClick={() => setCopilotOpen(!copilotOpen)}
                className="h-8 w-8 hover:bg-[#ffffff]/5 rounded-lg flex items-center justify-center text-[#dee9f3]/80"
                title="Toggle Copilot Panel"
              >
                <PanelRight className={`h-4 w-4 ${copilotOpen ? "text-[#dee9f3]/50" : "text-[#9dbbdd]"}`} />
              </button>
            </div>
          </header>

          {/* Dynamic Content */}
          <div className="flex-1 flex overflow-hidden min-h-0 bg-[#030609]/30">

            {/* TAB: WORKSPACE */}
            {currentTab === "workspace" && (
              <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Left Panel: Audio Transcription and Feed */}
                <section className="flex-1 flex flex-col border-r border-[#ffffff]/10 h-full overflow-hidden relative">
                  
                  {/* Audio Widget */}
                  <div className="p-4 border-b border-[#ffffff]/10 bg-[#030609]/60 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">Grabación de la Sesión</span>
                        <span className="text-[9px] text-[#dee9f3]/40">
                          {isRecording ? "Capturando audio en vivo..." : "Sincronizador offline activo"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {isRecording && (
                        <span className="text-sm font-mono text-rose-400 font-bold tracking-wider">
                          {Math.floor(recordingSeconds / 60).toString().padStart(2, "0")}:{(recordingSeconds % 60).toString().padStart(2, "0")}
                        </span>
                      )}
                      <button
                        onClick={toggleRecording}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isRecording 
                            ? "bg-[#822e36] text-white border border-red-500/30" 
                            : "bg-[#9dbbdd]/10 border border-[#9dbbdd]/20 text-[#9dbbdd] hover:bg-[#9dbbdd]/20"
                        }`}
                      >
                        {isRecording ? <Pause size={12} /> : <Play size={12} className="fill-current" />}
                        <span>{isRecording ? "Pausar" : "Grabar"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Transcription Feed */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 bg-[#030609]/20">
                    {transcriptLines.map((line, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border max-w-[85%] text-xs leading-relaxed ${
                          line.sender === "user"
                            ? "bg-[#ffffff]/5 border-[#ffffff]/5 mr-auto"
                            : "bg-[#9dbbdd]/5 border-[#9dbbdd]/10 ml-auto text-right"
                        }`}
                      >
                        <p>{line.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-[#ffffff]/10 bg-[#030609]/45 shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newChatText.trim()) return;
                        setTranscriptLines([...transcriptLines, { sender: "user", text: `Consultor: ${newChatText}` }]);
                        setNewChatText("");
                        triggerToast("Entrada de diálogo añadida.");
                      }}
                      className="flex items-center gap-2 bg-[#030609] border border-[#ffffff]/10 rounded-xl p-2 focus-within:border-[#9dbbdd] transition-all"
                    >
                      <textarea
                        value={newChatText}
                        onChange={(e) => setNewChatText(e.target.value)}
                        placeholder="Escribe un diálogo de relevamiento o una nota para la IA..."
                        rows={1}
                        className="flex-1 bg-transparent border-0 outline-none text-xs resize-none p-1 placeholder-[#dee9f3]/30 min-h-[32px] max-h-[100px]"
                      />
                      <button
                        type="submit"
                        className="p-2 bg-[#9dbbdd] text-[#030609] rounded-lg hover:opacity-90 transition-opacity shrink-0"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>
                </section>

                {/* Right Panel: Copilot Panel */}
                {copilotOpen && (
                  <section className="w-[350px] md:w-[380px] flex flex-col border-l border-[#ffffff]/10 h-full overflow-hidden bg-[#030609]/25 shrink-0">
                    {/* Header */}
                    <header className="p-4 border-b border-[#ffffff]/10 flex items-center gap-2 bg-[#030609]/45 shrink-0">
                      <Brain className="h-5 w-5 text-[#9dbbdd]" />
                      <h2 className="font-bold text-sm">Copiloto de Requerimientos</h2>
                    </header>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                      {/* Discovery Coverage Card */}
                      <div className="bg-[#030609]/45 border border-[#ffffff]/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>Cobertura de Descubrimiento</span>
                          <span className="text-[#9dbbdd]">{activeProject.coverage}%</span>
                        </div>
                        
                        {/* Custom Gradient Progress Bar */}
                        <div className="w-full bg-[#ffffff]/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#822e36] via-[#bd9c44] to-[#9dbbdd] transition-all duration-1000 ease-out"
                            style={{ width: `${activeProject.coverage}%` }}
                          />
                        </div>

                        {/* Category Stats */}
                        <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                          <div className="flex justify-between items-center p-1.5 rounded bg-[#ffffff]/5 border border-[#ffffff]/5">
                            <span className="text-[#dee9f3]/50">Reglas de Negocio</span>
                            <span className="font-bold font-mono">60%</span>
                          </div>
                          <div className="flex justify-between items-center p-1.5 rounded bg-[#ffffff]/5 border border-[#ffffff]/5">
                            <span className="text-[#dee9f3]/50">No Funcionales</span>
                            <span className="font-bold font-mono">45%</span>
                          </div>
                          <div className="flex justify-between items-center p-1.5 rounded bg-[#ffffff]/5 border border-[#ffffff]/5">
                            <span className="text-[#dee9f3]/50">Integraciones</span>
                            <span className="font-bold font-mono">75%</span>
                          </div>
                          <div className="flex justify-between items-center p-1.5 rounded bg-[#ffffff]/5 border border-[#ffffff]/5">
                            <span className="text-[#dee9f3]/50">Roles / Actores</span>
                            <span className="font-bold font-mono">50%</span>
                          </div>
                        </div>
                      </div>

                      {/* Copilot Tabs */}
                      <div className="flex bg-[#ffffff]/5 p-1 rounded-lg border border-[#ffffff]/10 shrink-0">
                        <button
                          onClick={() => setActiveCopilotTab("questions")}
                          className={`text-[10px] h-7 font-bold rounded-md flex-1 transition-all ${
                            activeCopilotTab === "questions" ? "bg-[#9dbbdd]/15 text-[#9dbbdd]" : "text-[#dee9f3]/60"
                          }`}
                        >
                          Preguntas
                        </button>
                        <button
                          onClick={() => setActiveCopilotTab("gaps")}
                          className={`text-[10px] h-7 font-bold rounded-md flex-1 transition-all ${
                            activeCopilotTab === "gaps" ? "bg-[#9dbbdd]/15 text-[#9dbbdd]" : "text-[#dee9f3]/60"
                          }`}
                        >
                          Vacíos
                        </button>
                        <button
                          onClick={() => setActiveCopilotTab("reqs")}
                          className={`text-[10px] h-7 font-bold rounded-md flex-1 transition-all ${
                            activeCopilotTab === "reqs" ? "bg-[#9dbbdd]/15 text-[#9dbbdd]" : "text-[#dee9f3]/60"
                          }`}
                        >
                          Requisitos
                        </button>
                      </div>

                      {/* Tab Content */}
                      <div className="space-y-2.5">
                        
                        {activeCopilotTab === "questions" && (
                          <div className="space-y-2">
                            {SUGGESTED_QUESTIONS.map((item, idx) => (
                              <div key={idx} className="p-3 bg-[#030609]/45 border border-[#ffffff]/10 hover:border-[#9dbbdd]/30 rounded-lg space-y-1.5 transition-all">
                                <div className="flex items-center justify-between text-[8px] font-bold">
                                  <span className={`px-1.5 py-0.5 rounded uppercase ${
                                    item.priority === "high" ? "bg-red-500/10 text-rose-400 border border-red-500/20" : "bg-[#bd9c44]/10 text-[#bd9c44]"
                                  }`}>{item.priority}</span>
                                  <span className="text-[#dee9f3]/40 uppercase tracking-wider">{item.category}</span>
                                </div>
                                <p className="text-xs font-semibold leading-relaxed text-[#dee9f3]">{item.question}</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTranscriptLines([...transcriptLines, { sender: "ai", text: `Relevamiento: ${item.question}` }]);
                                    triggerToast("Pregunta insertada al feed.");
                                  }}
                                  className="text-[9px] font-bold text-[#9dbbdd] hover:underline flex items-center gap-1"
                                >
                                  <span>Preguntar</span>
                                  <ArrowUpRight size={10} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeCopilotTab === "gaps" && (
                          <div className="space-y-2">
                            {gaps.map((item) => (
                              <div key={item.id} className={`p-3 rounded-lg border transition-all ${
                                item.resolved 
                                  ? "bg-emerald-500/5 border-emerald-500/10 opacity-60" 
                                  : "bg-[#822e36]/5 border-[#822e36]/15 hover:border-[#9dbbdd]/30"
                              }`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] uppercase tracking-wider bg-[#ffffff]/5 px-1.5 py-0.5 rounded font-mono text-[#dee9f3]/50">
                                    {item.category}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGaps(gaps.map(g => g.id === item.id ? { ...g, resolved: !g.resolved } : g));
                                      triggerToast(item.resolved ? "Vacío re-abierto" : "Vacío marcado como resuelto");
                                    }}
                                    className={`text-[9px] font-bold ${item.resolved ? "text-[#dee9f3]/40" : "text-emerald-400 hover:underline"}`}
                                  >
                                    {item.resolved ? "Re-abrir" : "Resolver"}
                                  </button>
                                </div>
                                <p className="text-xs font-semibold mt-1 text-[#dee9f3]">{item.question}</p>
                                <p className="text-[10px] text-[#dee9f3]/50 mt-1 italic leading-normal">Motivo: {item.reason}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeCopilotTab === "reqs" && (
                          <div className="space-y-2">
                            {requirements.map((item) => (
                              <div key={item.id} className="p-3 bg-[#030609]/45 border border-[#ffffff]/10 rounded-lg space-y-1 hover:border-[#9dbbdd]/20 transition-all">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#dee9f3]">{item.title}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRequirements(requirements.filter(r => r.id !== item.id));
                                      triggerToast("Requerimiento descartado");
                                    }}
                                    className="text-[#dee9f3]/40 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                                <p className="text-[10px] text-[#dee9f3]/60 leading-normal">{item.content}</p>
                                <div className="flex items-center gap-2 mt-1.5 text-[8px] uppercase font-bold text-[#dee9f3]/40">
                                  <span className="text-[#9dbbdd]">{item.type}</span>
                                  <span>•</span>
                                  <span>prioridad {item.priority}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  </section>
                )}
              </div>
            )}

            {/* TAB: REPORT & PRICING */}
            {currentTab === "report" && (
              <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Left Panel: Adjustments Panel */}
                <section className="w-80 border-r border-[#ffffff]/10 h-full p-4 flex flex-col justify-between bg-[#030609]/45 shrink-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="text-[#9dbbdd]" size={18} />
                      <span className="text-xs font-bold">Simulación de Presupuesto</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      {/* Inputs */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#dee9f3]/50 uppercase">Tipo de Cliente</label>
                        <select
                          value={clientType}
                          onChange={(e) => setClientType(e.target.value as any)}
                          className="w-full bg-[#030609] border border-[#ffffff]/10 rounded-lg p-2 text-xs text-[#dee9f3]"
                        >
                          <option value="STARTUP">Startup (Multiplicador 0.95x)</option>
                          <option value="SME">SME / Pyme (Multiplicador 1.0x)</option>
                          <option value="ENTERPRISE">Corporativo (Multiplicador 1.20x)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#dee9f3]/50 uppercase">Urgencia del Proyecto</label>
                        <select
                          value={urgency}
                          onChange={(e) => setUrgency(e.target.value as any)}
                          className="w-full bg-[#030609] border border-[#ffffff]/10 rounded-lg p-2 text-xs text-[#dee9f3]"
                        >
                          <option value="FLEXIBLE">Flexible (0.90x)</option>
                          <option value="NORMAL">Normal (1.0x)</option>
                          <option value="URGENT">Urgente / Fast delivery (1.25x)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-[#dee9f3]/55 uppercase">
                          <span>Horas Estimadas</span>
                          <span className="text-[#9dbbdd]">{devHours} hrs</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="250"
                          value={devHours}
                          onChange={(e) => setDevHours(Number(e.target.value))}
                          className="w-full accent-[#9dbbdd] bg-[#ffffff]/5 h-1 rounded"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-[#dee9f3]/55 uppercase">
                          <span>Tarifa por Hora</span>
                          <span className="text-[#9dbbdd]">${hourlyRate} USD</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="100"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(Number(e.target.value))}
                          className="w-full accent-[#9dbbdd] bg-[#ffffff]/5 h-1 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-[#dee9f3]/50 uppercase">Margen Ganancia</label>
                          <input
                            type="number"
                            value={profitMargin}
                            onChange={(e) => setProfitMargin(Number(e.target.value) || 0)}
                            className="w-full bg-[#030609] border border-[#ffffff]/10 rounded-lg p-2 text-xs text-[#dee9f3]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-[#dee9f3]/50 uppercase">Margen Riesgo</label>
                          <input
                            type="number"
                            value={riskFactor}
                            onChange={(e) => setRiskFactor(Number(e.target.value) || 0)}
                            className="w-full bg-[#030609] border border-[#ffffff]/10 rounded-lg p-2 text-xs text-[#dee9f3]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Refinement input */}
                  <div className="space-y-2 pt-4 border-t border-[#ffffff]/10">
                    <span className="text-[10px] font-bold text-[#dee9f3]/40 block uppercase">Instrucciones de Ajuste</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g., añade soporte de pagos..."
                        value={refineInput}
                        onChange={(e) => setRefineInput(e.target.value)}
                        className="flex-1 bg-[#030609] border border-[#ffffff]/10 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!refineInput.trim()) return;
                          triggerToast("Ajustando informe de costos...");
                          setRefineInput("");
                        }}
                        className="p-1.5 bg-[#9dbbdd] text-[#030609] rounded-lg hover:opacity-95 transition-all"
                      >
                        <Send size={13} />
                      </button>
                    </div>
                  </div>
                </section>

                {/* Right Panel: Invoice & Breakdown */}
                <section className="flex-1 flex flex-col h-full overflow-hidden bg-[#030609]/20">
                  {/* Top tabs */}
                  <div className="px-6 py-3 border-b border-[#ffffff]/10 bg-[#030609]/45 flex items-center justify-between shrink-0">
                    <div className="flex bg-[#ffffff]/5 p-1 rounded-lg border border-[#ffffff]/10 shrink-0">
                      <button
                        onClick={() => setActiveReportTab("client")}
                        className={`text-xs h-7 px-3.5 font-semibold rounded-md transition-all ${
                          activeReportTab === "client" ? "bg-[#9dbbdd]/15 text-[#9dbbdd]" : "text-[#dee9f3]/60 hover:text-[#dee9f3]"
                        }`}
                      >
                        Propuesta para Cliente
                      </button>
                      <button
                        onClick={() => setActiveReportTab("internal")}
                        className={`text-xs h-7 px-3.5 font-semibold rounded-md transition-all ${
                          activeReportTab === "internal" ? "bg-[#9dbbdd]/15 text-[#9dbbdd]" : "text-[#dee9f3]/60 hover:text-[#dee9f3]"
                        }`}
                      >
                        Análisis de Costos
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerToast("Preparando impresión del PDF...")}
                      className="p-1.5 hover:bg-[#ffffff]/5 border border-[#ffffff]/10 rounded-lg text-[#dee9f3]/70"
                      title="Imprimir Propuesta"
                    >
                      <Printer size={14} />
                    </button>
                  </div>

                  {/* Report Display */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5 min-h-0">
                    {activeReportTab === "client" ? (
                      <div className="space-y-4 max-w-xl mx-auto text-xs leading-relaxed text-[#dee9f3]/80">
                        <div className="border-b border-[#ffffff]/10 pb-4">
                          <h2 className="text-sm font-bold text-white uppercase tracking-wider">PROPUESTA DE SOFTWARE INICIAL</h2>
                          <p className="text-[10px] text-[#dee9f3]/40 mt-1">Proyecto: {activeProject.name}</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-bold text-white">1. Objetivos del Proyecto</h3>
                          <p>Diseño e implementación de un core transaccional optimizado, con integraciones de pasarelas de pago Stripe, arquitectura basada en roles, y soporte de Server-Side Rendering para un performance ultra-rápido.</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-bold text-white">2. Módulos y Horas Estimadas</h3>
                          <ul className="list-disc pl-4 space-y-1 text-[11px]">
                            <li><strong>Pasarela de Cobros (Stripe):</strong> Suscripciones recurrentes y tokens cifrados. (40 horas)</li>
                            <li><strong>Dashboard de Clientes & Roles:</strong> Panel modular e intuitivo. (50 horas)</li>
                            <li><strong>Performance & SEO (SSR/Redis):</strong> Optimización en la entrega. (30 horas)</li>
                          </ul>
                        </div>

                        <div className="space-y-2 border-t border-[#ffffff]/10 pt-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-white">Inversión Estimada Total:</span>
                            <span className="font-black text-[#9dbbdd]">${totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })} USD</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 max-w-xl mx-auto text-xs font-mono">
                        <h3 className="text-xs font-bold text-white border-b border-[#ffffff]/10 pb-2">DESGLOSE DE COSTOS INTERNOS</h3>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-[#dee9f3]/50">Costo de Esfuerzo de Desarrollo:</span>
                            <span>${baseCost.toLocaleString("en-US")} USD</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#dee9f3]/50">Margen de Beneficio ({profitMargin}%):</span>
                            <span>+${profitAmount.toLocaleString("en-US")} USD</span>
                          </div>
                          <div className="flex justify-between border-b border-[#ffffff]/10 pb-2">
                            <span className="text-[#dee9f3]/50">Amortización de Riesgo ({riskFactor}%):</span>
                            <span>+${riskAmount.toLocaleString("en-US")} USD</span>
                          </div>
                          
                          <div className="flex justify-between font-bold pt-1">
                            <span className="text-white">Subtotal Estimado:</span>
                            <span>${subtotal.toLocaleString("en-US")} USD</span>
                          </div>

                          <div className="flex justify-between text-[#bd9c44] text-[11px] pt-2">
                            <span>Ajuste por tipo de cliente ({clientType}):</span>
                            <span>x{clientMultiplier}</span>
                          </div>
                          <div className="flex justify-between text-[#bd9c44] text-[11px] border-b border-[#ffffff]/10 pb-2">
                            <span>Ajuste por nivel de urgencia ({urgency}):</span>
                            <span>x{urgencyMultiplier}</span>
                          </div>

                          <div className="flex justify-between text-sm font-black text-white pt-2">
                            <span>TOTAL SUGERIDO FINAL:</span>
                            <span className="text-[#9dbbdd]">${totalCost.toLocaleString("en-US", { maximumFractionDigits: 2 })} USD</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Modal: Crear Proyecto */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-[#030609]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#030609] border border-[#ffffff]/15 rounded-xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in duration-200">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-white">
              <Plus className="h-4 w-4 text-[#9dbbdd]" /> Crear Nuevo Proyecto
            </h3>
            <p className="text-xs text-[#dee9f3]/60 mb-4 leading-normal">
              Ingresa el nombre del software o sistema que vas a relevar para iniciar la sesión.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="e.g. Portal de E-commerce, App de Delivery..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full text-xs bg-[#030609] border border-[#ffffff]/15 rounded-lg p-2.5 focus:outline-none focus:border-[#9dbbdd] text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateProject();
                }}
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewProjectName("");
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg hover:bg-[#ffffff]/5 text-[#dee9f3]/60"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateProject}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#9dbbdd] text-[#030609] font-bold hover:opacity-90"
                >
                  Crear Proyecto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Tips */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-[#030609]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#030609] border border-[#ffffff]/15 rounded-xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in duration-200">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-white">
              <HelpCircle className="h-4 w-4 text-[#9dbbdd]" /> Tips de Relevamiento
            </h3>
            <div className="space-y-3 text-xs text-[#dee9f3]/80 leading-relaxed max-h-[300px] overflow-y-auto pr-1">
              <p>💡 <strong>Escucha Activa:</strong> Deja que el cliente describa el proceso comercial completo antes de proponer integraciones o APIs.</p>
              <p>⚡ <strong>Vacíos de Información:</strong> Si el cliente olvida detallar la administración de estados, la IA del copiloto lo marcará en la sección de vacíos automáticamente.</p>
              <p>💰 <strong>Márgenes de Seguridad:</strong> Siempre añade entre un 10% y un 20% extra de factor de riesgo para cubrir contingencias imprevistas del backend.</p>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="text-xs px-4 py-1.5 rounded-lg bg-[#9dbbdd] text-[#030609] font-bold hover:opacity-90"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
