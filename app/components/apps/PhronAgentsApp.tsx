"use client";

import React, { useState } from "react";
import { 
  Bot, 
  MessageSquare, 
  Zap, 
  Settings, 
  Send, 
  Search, 
  Sparkles, 
  RefreshCw, 
  X, 
  Shield,
  Layers,
  Phone,
  Trash2,
  Edit2,
  Plus,
  Globe,
  FileSpreadsheet,
  Link as LinkIcon,
  Users,
  ShoppingBag,
  SlidersHorizontal
} from "lucide-react";

// ==========================================
// CUSTOM EMBEDDED ICONS (for visual fidelity)
// ==========================================
const ChevronsUpDownIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m7 15 5 5 5-5"/>
    <path d="m7 9 5-5 5 5"/>
  </svg>
);

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface Agent {
  id: string;
  name: string;
  emoji: string;
  promptBase: string;
  temperature: number;
  dailyLimit: number;
  status: "ACTIVE" | "INACTIVE";
  conversations: number;
  model: string;
}

interface Conversation {
  id: string;
  customerName: string;
  phoneNumber: string;
  channel: "WHATSAPP" | "TELEGRAM";
  status: "ACTIVE_IA" | "PAUSED" | "CLOSED";
  lastMessage: string;
  time: string;
  messages: {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    time: string;
  }[];
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  channel: "WHATSAPP" | "TELEGRAM";
  createdAt: string;
  lastInterest: string;
  status: "ACTIVE_IA" | "PAUSED" | "CLOSED";
}

// ==========================================
// MOCK DATA
// ==========================================
const INITIAL_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Soporte Ventas AI",
    emoji: "💼",
    promptBase: "Eres un agente de ventas experto para PhronAgents. Responde de forma amable, persuasiva y siempre ofreciendo ayuda para concretar la venta de productos en base al catálogo.",
    temperature: 0.2,
    dailyLimit: 250,
    status: "ACTIVE",
    conversations: 1247,
    model: "GPT-4o"
  },
  {
    id: "agent-2",
    name: "Soporte Técnico Especializado",
    emoji: "🛠️",
    promptBase: "Ayuda a los clientes a solucionar problemas de integración, tokens de WhatsApp y configuración de webhooks en la plataforma.",
    temperature: 0.1,
    dailyLimit: 150,
    status: "ACTIVE",
    conversations: 856,
    model: "Claude 3.5 Sonnet"
  },
  {
    id: "agent-3",
    name: "Fidelización y Onboarding",
    emoji: "🚀",
    promptBase: "Saluda a los nuevos usuarios y guíalos paso a paso en la creación de su primera organización y conexión de canal.",
    temperature: 0.4,
    dailyLimit: 100,
    status: "INACTIVE",
    conversations: 312,
    model: "GPT-4o-mini"
  }
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c-1",
    customerName: "Carlos Mendoza",
    phoneNumber: "+54 9 11 5555-0123",
    channel: "WHATSAPP",
    status: "ACTIVE_IA",
    lastMessage: "¿Tienen stock del plan Enterprise?",
    time: "Hace 2 mins",
    messages: [
      { id: "m1-1", role: "user", content: "Hola, quisiera saber los precios de sus planes de IA.", time: "10:30 AM" },
      { id: "m1-2", role: "assistant", content: "¡Hola Carlos! Qué gusto saludarte. El plan Pro cuesta $49/mes e incluye 2 canales. También tenemos el plan Enterprise adaptado a tus necesidades. ¿Cuántos chats manejan al día?", time: "10:31 AM" },
      { id: "m1-3", role: "user", content: "¿Tienen stock del plan Enterprise?", time: "10:32 AM" }
    ]
  },
  {
    id: "c-2",
    customerName: "Sofía Rossi",
    phoneNumber: "+56 9 8888-7766",
    channel: "TELEGRAM",
    status: "ACTIVE_IA",
    lastMessage: "Gracias, el bot me resolvió la duda de los webhooks.",
    time: "Hace 15 mins",
    messages: [
      { id: "m2-1", role: "user", content: "Hola, ¿dónde encuentro la URL de webhook?", time: "10:10 AM" },
      { id: "m2-2", role: "assistant", content: "Hola Sofía. La encuentras en la sección de Integraciones. Debes configurarla en la consola de Meta o Telegram para vincular tus canales.", time: "10:11 AM" },
      { id: "m2-3", role: "user", content: "Gracias, el bot me resolvió la duda de los webhooks.", time: "10:12 AM" }
    ]
  },
  {
    id: "c-3",
    customerName: "Alejandro Gómez",
    phoneNumber: "+34 600 123 456",
    channel: "WHATSAPP",
    status: "PAUSED",
    lastMessage: "Quiero hablar con un agente humano por favor.",
    time: "Hace 1 hora",
    messages: [
      { id: "m3-1", role: "user", content: "El bot no entiende mi caso de facturación.", time: "09:15 AM" },
      { id: "m3-2", role: "assistant", content: "Disculpa las molestias Alejandro. Si gustas, puedo transferirte con un asesor humano.", time: "09:16 AM" },
      { id: "m3-3", role: "user", content: "Quiero hablar con un agente humano por favor.", time: "09:16 AM" },
      { id: "m3-4", role: "system", content: "Chat pausado. IA inactiva. Esperando agente humano.", time: "09:17 AM" }
    ]
  },
  {
    id: "c-4",
    customerName: "Mariana Silva",
    phoneNumber: "+55 11 99999-5555",
    channel: "WHATSAPP",
    status: "CLOSED",
    lastMessage: "Pedido completado con éxito.",
    time: "Hace 4 horas",
    messages: [
      { id: "m4-1", role: "user", content: "Quiero comprar un teclado mecánico RGB.", time: "06:00 AM" },
      { id: "m4-2", role: "assistant", content: "¡Excelente elección! Tenemos el Teclado Keychron K2 en stock por $99. ¿Deseas confirmar tu pedido?", time: "06:02 AM" },
      { id: "m4-3", role: "user", content: "Sí, confírmalo.", time: "06:03 AM" },
      { id: "m4-4", role: "assistant", content: "Perfecto Mariana. Pedido completado con éxito. Se enviará a tu dirección registrada.", time: "06:04 AM" }
    ]
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p-1",
    sku: "KEY-K2-RGB",
    name: "Teclado Keychron K2 RGB",
    description: "Teclado mecánico inalámbrico al 75% con switches Gateron G Pro y retroiluminación RGB.",
    price: 99.00,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150",
    category: "Teclados"
  },
  {
    id: "p-2",
    sku: "MOU-MXM-3S",
    name: "Mouse Logitech MX Master 3S",
    description: "Mouse inalámbrico ergonómico de alta precisión con sensor de 8K DPI y clics silenciosos.",
    price: 109.00,
    stock: 24,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150",
    category: "Mouses"
  },
  {
    id: "p-3",
    sku: "EAR-AP-PRO2",
    name: "Auriculares AirPods Pro 2",
    description: "Auriculares de botón con cancelación activa de ruido avanzada y audio espacial.",
    price: 249.00,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=150",
    category: "Audio"
  },
  {
    id: "p-4",
    sku: "MON-U27-4K",
    name: "Monitor Dell UltraSharp 27\" 4K",
    description: "Monitor profesional USB-C con resolución IPS, HDR y cobertura de color sRGB del 99%.",
    price: 459.00,
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150",
    category: "Monitores"
  }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "Carlos Mendoza", phone: "+54 9 11 5555-0123", channel: "WHATSAPP", createdAt: "2026-06-15", lastInterest: "Planes Enterprise", status: "ACTIVE_IA" },
  { id: "cust-2", name: "Sofía Rossi", phone: "+56 9 8888-7766", channel: "TELEGRAM", createdAt: "2026-06-20", lastInterest: "Configuración Webhooks", status: "ACTIVE_IA" },
  { id: "cust-3", name: "Alejandro Gómez", phone: "+34 600 123 456", channel: "WHATSAPP", createdAt: "2026-06-25", lastInterest: "Soporte Técnico Facturas", status: "PAUSED" },
  { id: "cust-4", name: "Mariana Silva", phone: "+55 11 99999-5555", channel: "WHATSAPP", createdAt: "2026-07-01", lastInterest: "Comprar Teclado Keychron", status: "CLOSED" },
  { id: "cust-5", name: "Luis Fernandez", phone: "+591 7722-3344", channel: "TELEGRAM", createdAt: "2026-07-05", lastInterest: "Precios de auriculares", status: "ACTIVE_IA" }
];

type TabType = "dashboard" | "playground" | "agents" | "conversations" | "products" | "integrations" | "customers" | "settings";

export default function PhronAgentsApp() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Core local states
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);

  // Configuration settings states (Set defaults matching the user's screenshot)
  const [orgName, setOrgName] = useState("EuroBO");
  const [currency, setCurrency] = useState("BOB");
  const [metaPhoneId, setMetaPhoneId] = useState("105847395729185");
  const [metaAccessToken, setMetaAccessToken] = useState("EAAGb3...");
  const [telegramToken, setTelegramToken] = useState("");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("https://docs.google.com/spreadsheets/d/1X5...");
  
  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string>("c-1");
  const [playgroundInput, setPlaygroundInput] = useState("");
  const [playgroundMessages, setPlaygroundMessages] = useState<{role: string, content: string}[]>([
    { role: "assistant", content: "¡Hola! Soy el agente inteligente de pruebas de PhronAgents. ¿Qué deseas consultar hoy?" }
  ]);
  const [liveChatInput, setLiveChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Product modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    sku: "",
    name: "",
    price: 0,
    stock: 0,
    category: "General",
    description: ""
  });

  // Display a temporary notification toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync catalog from Google Sheets (Mocked action)
  const handleSyncSheets = () => {
    if (!googleSheetUrl) {
      showToast("Error: Configura la URL del Google Sheet primero.");
      return;
    }
    setIsSyncing(true);
    showToast("Sincronizando inventario con Google Sheets...");
    
    setTimeout(() => {
      const syncedProducts = [
        ...products.map(p => ({ ...p, stock: p.stock + 5 })),
        {
          id: `p-${Date.now()}`,
          sku: "SHEET-NEW-1",
          name: "Soporte de Aluminio Laptop",
          description: "Soporte ergonómico plegable para ordenadores portátiles de hasta 17 pulgadas, importado de Sheets.",
          price: 35.00,
          stock: 50,
          imageUrl: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=150",
          category: "Accesorios"
        }
      ];
      setProducts(syncedProducts);
      setIsSyncing(false);
      showToast("Catálogo sincronizado con éxito. ¡1 nuevo producto importado!");
    }, 1500);
  };

  // Agent updates
  const handleUpdateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    showToast("Ajustes del agente actualizados correctamente.");
  };

  // Simulated AI Playground Chat
  const handlePlaygroundSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playgroundInput.trim()) return;

    const userMessage = playgroundInput.trim();
    setPlaygroundMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setPlaygroundInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = "No encuentro detalles de ese producto en mi base de datos de PhronAgents. ¿Deseas ver el catálogo?";
      const lower = userMessage.toLowerCase();
      
      const matchedProd = products.find(p => lower.includes(p.name.toLowerCase()) || lower.includes(p.sku.toLowerCase()) || lower.includes(p.category.toLowerCase()));
      
      if (matchedProd) {
        aiResponse = `¡Sí! El ${matchedProd.name} (${matchedProd.sku}) está disponible a un precio de ${currency} ${matchedProd.price}. Nos quedan ${matchedProd.stock} unidades en almacén. ¿Te gustaría reservarlo?`;
      } else if (lower.includes("hola") || lower.includes("buenas")) {
        aiResponse = `¡Hola! Bienvenido a ${orgName}. Estoy configurado para asistirte con nuestro catálogo de productos en tiempo real. ¿En qué te puedo ayudar?`;
      } else if (lower.includes("precio") || lower.includes("costo")) {
        aiResponse = `Nuestros artículos van desde $35 hasta $459. ¿Te interesa algún producto en particular como teclados, mouses o audífonos?`;
      } else if (lower.includes("soporte") || lower.includes("humano")) {
        aiResponse = `Entiendo. Puedo derivarte con un agente humano. Por favor aguarda un momento en línea.`;
      }

      setPlaygroundMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
    }, 1000);
  };

  // Live Chat Manual takeover message
  const handleLiveChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatInput.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      role: "assistant" as const,
      content: liveChatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          status: "PAUSED",
          lastMessage: newMsg.content,
          time: "Ahora",
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    const currentConv = conversations.find(c => c.id === activeConversationId);
    if (currentConv) {
      setCustomers(prev => prev.map(cust => cust.phone === currentConv.phoneNumber ? { ...cust, status: "PAUSED" } : cust));
    }

    setLiveChatInput("");
    showToast("Mensaje enviado. La IA ha sido desactivada temporalmente para esta conversación.");
  };

  // Toggle IA back on
  const handleReactivateIA = (id: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        const sysMsg = {
          id: `sys-${Date.now()}`,
          role: "system" as const,
          content: "IA reactivada. Las respuestas automáticas se reanudan.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...c,
          status: "ACTIVE_IA",
          messages: [...c.messages, sysMsg]
        };
      }
      return c;
    }));

    const currentConv = conversations.find(c => c.id === id);
    if (currentConv) {
      setCustomers(prev => prev.map(cust => cust.phone === currentConv.phoneNumber ? { ...cust, status: "ACTIVE_IA" } : cust));
    }

    showToast("Respuestas automáticas de la IA reactivadas para este chat.");
  };

  // Product CRUD
  const handleOpenProductModal = (prod: Product | null = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        sku: prod.sku,
        name: prod.name,
        price: prod.price,
        stock: prod.stock,
        category: prod.category,
        description: prod.description
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        sku: "",
        name: "",
        price: 0,
        stock: 10,
        category: "General",
        description: ""
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku) {
      showToast("Ingresa al menos el nombre y SKU del producto.");
      return;
    }

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        sku: productForm.sku,
        name: productForm.name,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        category: productForm.category,
        description: productForm.description
      } : p));
      showToast(`Producto ${productForm.sku} actualizado.`);
    } else {
      const newProd: Product = {
        id: `p-${Date.now()}`,
        sku: productForm.sku,
        name: productForm.name,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        description: productForm.description,
        category: productForm.category,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150"
      };
      setProducts(prev => [...prev, newProd]);
      showToast(`Producto ${productForm.sku} registrado en catálogo.`);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto del catálogo?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Producto eliminado.");
    }
  };

  // Helpers
  const formatCurrency = (val: number) => {
    const symbols: Record<string, string> = { USD: "$", BOB: "Bs", ARS: "$", EUR: "€" };
    return `${symbols[currency] || currency} ${val.toFixed(2)}`;
  };

  const selectedConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  return (
    <div className="w-full h-full min-h-[600px] flex bg-[#09090b] text-slate-100 font-sans select-none overflow-hidden relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-indigo-600 border border-indigo-500 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-xl shadow-indigo-950/55 animate-bounce">
          <Sparkles size={14} className="text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern Sidebar (matching user screenshot) */}
      <aside className="w-64 bg-[#09090b] border-r border-zinc-900 flex flex-col shrink-0">
        <div className="h-16 px-5 border-b border-zinc-900 flex items-center justify-between bg-[#09090b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
              <ShoppingBag size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs tracking-tight text-white">{orgName}</span>
              <span className="text-[10px] text-slate-400 font-medium">Moneda: {currency}</span>
            </div>
          </div>
          <div className="text-slate-500 hover:text-slate-300 cursor-pointer">
            <ChevronsUpDownIcon className="h-4 w-4" />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1.5">
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 mt-1">Navegación</span>
          {[
            { id: "dashboard", label: "Inicio", icon: <Layers size={14} /> },
            { id: "playground", label: "Playground de Pruebas", icon: <Bot size={14} /> },
            { id: "agents", label: "Ajustes del Agente", icon: <SlidersHorizontal size={14} /> },
            { id: "conversations", label: "Chats en Vivo", icon: <MessageSquare size={14} /> },
            { id: "products", label: "Catálogo de Productos", icon: <ShoppingBag size={14} /> },
            { id: "integrations", label: "Integraciones", icon: <Globe size={14} /> },
            { id: "customers", label: "Clientes / Leads", icon: <Users size={14} /> },
            { id: "settings", label: "Configuración", icon: <Settings size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all ${
                activeTab === tab.id 
                  ? "bg-zinc-900 text-white font-medium border border-white/5" 
                  : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User profile footer matching user screenshot */}
        <div className="p-4 border-t border-zinc-900 bg-[#09090b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-bold font-mono">
              N
            </div>
            <div className="flex flex-col overflow-hidden text-left">
              <span className="text-xs font-semibold text-slate-200 truncate">Ludwing Armijo</span>
              <span className="text-[9px] text-slate-500 truncate">ludwing</span>
            </div>
          </div>
          <div className="text-slate-500">
            <ChevronsUpDownIcon className="h-3.5 w-3.5" />
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#09090b]">
        
        {/* Main Header with breadcrumbs */}
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-[#09090b]">
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-slate-200">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>
            </button>
            <span className="text-xs text-slate-500">/</span>
            <span className="text-xs font-medium text-slate-200">
              {activeTab === "dashboard" && "Panel de Control"}
              {activeTab === "playground" && "Playground de Pruebas"}
              {activeTab === "agents" && "Ajustes del Agente"}
              {activeTab === "conversations" && "Chats en Vivo"}
              {activeTab === "products" && "Catálogo de Productos"}
              {activeTab === "integrations" && "Integraciones"}
              {activeTab === "customers" && "Clientes / Leads"}
              {activeTab === "settings" && "Configuración"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Conectado
            </div>
          </div>
        </header>

        {/* Tab Contents */}
        <div className="flex-1 overflow-auto p-6">
          
          {/* TAB: DASHBOARD (Inicio) */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Bienvenido de nuevo, Ludwing Armijo a Phron Agents
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Plataforma para gestión de chatbots IA. Aquí tienes el estado operativo actual de tu organización.
                </p>
              </div>

              {/* Grid de Métricas matching exact colors & borders */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Clientes Totales", value: customers.length > 5 ? customers.length : 6, desc: "Contactos activos capturados", color: "text-blue-500", border: "border-blue-500/20", grad: "from-blue-500/10 via-cyan-500/5 to-transparent", tab: "customers" },
                  { name: "Productos en Catálogo", value: products.length > 4 ? products.length : 108, desc: "Variantes activas disponibles", color: "text-emerald-500", border: "border-emerald-500/20", grad: "from-emerald-500/10 via-teal-500/5 to-transparent", tab: "products" },
                  { name: "Conversaciones de la IA", value: conversations.filter(c => c.status === "ACTIVE_IA").length > 2 ? conversations.filter(c => c.status === "ACTIVE_IA").length : 6, desc: "Chats autónomos procesados", color: "text-violet-500", border: "border-violet-500/20", grad: "from-violet-500/10 via-purple-500/5 to-transparent", tab: "conversations" },
                  { name: "Pedidos Registrados", value: 0, desc: "Ventas cerradas por chat", color: "text-amber-500", border: "border-amber-500/20", grad: "from-amber-500/10 via-orange-500/5 to-transparent", tab: "conversations" }
                ].map(stat => (
                  <button
                    key={stat.name}
                    onClick={() => setActiveTab(stat.tab as TabType)}
                    className={`rounded-xl border ${stat.border} bg-gradient-to-b ${stat.grad} p-5 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] block w-full`}
                  >
                    <span className="text-xs font-semibold text-slate-400">{stat.name}</span>
                    <div className="mt-2">
                      <span className={`text-3xl font-extrabold tracking-tight ${stat.color}`}>{stat.value}</span>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{stat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Acciones Rápidas matching visual hierarchy */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight text-slate-300">Acciones Rápidas</h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { title: "Probar el Agente IA", desc: "Simula una conversación de cliente en el Playground para verificar cómo responde tu vendedor.", icon: <MessageSquare size={16} />, color: "text-violet-400 bg-violet-950/40 border-violet-800/30", tab: "playground" },
                    { title: "Sincronizar Inventario", desc: "Importa productos desde tu hoja de Google Sheets para mantener el catálogo actualizado.", icon: <RefreshCw size={16} />, color: "text-emerald-400 bg-emerald-950/40 border-emerald-800/30", tab: "integrations" },
                    { title: "Gestionar Productos", desc: "Revisa stock, precios y variantes de tu catálogo para que el bot cotice correctamente.", icon: <ShoppingBag size={16} />, color: "text-blue-400 bg-blue-950/40 border-blue-800/30", tab: "products" },
                    { title: "Configurar Canales", desc: "Vincula tu WhatsApp Business o Bot de Telegram para recibir mensajes en vivo.", icon: <Settings size={16} />, color: "text-amber-400 bg-amber-950/40 border-amber-800/30", tab: "settings" }
                  ].map(action => (
                    <button
                      key={action.title}
                      onClick={() => setActiveTab(action.tab as TabType)}
                      className="group text-left rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-zinc-800 flex flex-col gap-3"
                    >
                      <div className={`w-9 h-9 rounded-lg ${action.color} border flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                        {action.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-slate-200 group-hover:text-white transition-colors">{action.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{action.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart & Live Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#09090b] border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200">Volumen de Chats Recibidos</span>
                      <span className="text-[10px] text-slate-400">Mensajes procesados por IA y derivaciones</span>
                    </div>
                    <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 font-semibold">
                      Últimas 24 horas
                    </span>
                  </div>

                  <div className="w-full h-44 relative bg-zinc-900/10 rounded-xl border border-zinc-900 p-2 flex flex-col justify-between">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="dashboardChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="10" x2="100" y2="10" stroke="#1e293b" strokeWidth="0.25" strokeDasharray="1.5" />
                      <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.25" strokeDasharray="1.5" />
                      <line x1="0" y1="30" x2="100" y2="30" stroke="#1e293b" strokeWidth="0.25" strokeDasharray="1.5" />
                      <path d="M 0,40 L 0,30 Q 15,10 30,25 T 60,10 T 80,28 L 100,5 L 100,40 Z" fill="url(#dashboardChartGrad)" />
                      <path d="M 0,30 Q 15,10 30,25 T 60,10 T 80,28 L 100,5" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="30" cy="25" r="1.5" fill="#818cf8" stroke="#000000" strokeWidth="0.5" />
                      <circle cx="60" cy="10" r="1.5" fill="#818cf8" stroke="#000000" strokeWidth="0.5" />
                      <circle cx="100" cy="5" r="1.5" fill="#818cf8" stroke="#000000" strokeWidth="0.5" />
                    </svg>
                  </div>
                </div>

                <div className="bg-[#09090b] border border-zinc-900 p-5 rounded-2xl flex flex-col">
                  <span className="text-xs font-bold text-slate-200 mb-3">Últimas Conversaciones</span>
                  <div className="space-y-3 overflow-y-auto flex-1 max-h-48 pr-1">
                    {conversations.slice(0, 3).map(conv => (
                      <div key={conv.id} className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 flex items-center justify-between text-xs hover:border-zinc-800">
                        <div className="flex flex-col gap-0.5 text-left">
                          <span className="font-semibold text-slate-200">{conv.customerName}</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[140px]">{conv.lastMessage}</span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          conv.status === "ACTIVE_IA" ? "bg-violet-950 text-violet-400 border border-violet-800/30" : 
                          conv.status === "PAUSED" ? "bg-amber-950 text-amber-400 border border-amber-800/30" : 
                          "bg-zinc-850 text-slate-400 border border-zinc-700/30"
                        }`}>
                          {conv.status === "ACTIVE_IA" ? "IA Activa" : conv.status === "PAUSED" ? "Pausado" : "Cerrado"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PLAYGROUND DE PRUEBAS */}
          {activeTab === "playground" && (
            <div className="space-y-4 animate-fadeIn max-w-4xl mx-auto h-[calc(100vh-170px)] flex flex-col">
              <div className="text-left">
                <h2 className="text-lg font-bold text-slate-100">Playground de Simulación</h2>
                <p className="text-xs text-slate-400 text-left">Prueba cómo responde tu vendedor inteligente. El bot lee automáticamente tu catálogo de productos cargado.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 overflow-hidden min-h-0">
                {/* Left controls */}
                <div className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl space-y-4 text-xs h-fit text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agente Activo</label>
                    <select className="w-full h-8 px-2 bg-[#09090b] border border-zinc-900 rounded text-xs text-white">
                      {agents.map(a => <option key={a.id} value={a.id}>{a.emoji} {a.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Canal Simulado</label>
                    <div className="flex gap-2">
                      <span className="px-3 py-1.5 bg-[#09090b] border border-indigo-600/30 text-indigo-400 rounded-md font-semibold flex-1 text-center">WhatsApp</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-300 block mb-1">🔍 Tip de Prueba:</span>
                    <p className="text-[9px] text-slate-400 leading-normal">Pregunta por productos específicos del catálogo (por ejemplo: &quot;AirPods Pro&quot; o &quot;Keychron&quot;) para comprobar si responde con stock y precios correctos.</p>
                  </div>
                </div>

                {/* Chat window */}
                <div className="md:col-span-3 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col overflow-hidden h-full">
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-950/20">
                    {playgroundMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                          msg.role === "user" 
                            ? "bg-indigo-600 text-white font-medium" 
                            : "bg-[#09090b] border border-zinc-900 text-slate-200 text-left"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-[#09090b] border border-zinc-900 rounded-xl p-2 px-3 text-xs text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handlePlaygroundSend} className="p-3 border-t border-zinc-900 bg-zinc-950 flex gap-2">
                    <input 
                      type="text"
                      placeholder="Escribe tu pregunta simulada como cliente..."
                      value={playgroundInput}
                      onChange={(e) => setPlaygroundInput(e.target.value)}
                      className="flex-1 h-9 px-3 text-xs bg-[#09090b] border border-zinc-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                    />
                    <button type="submit" className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-500">
                      <Send size={15} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: AJUSTES DEL AGENTE */}
          {activeTab === "agents" && (
            <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto text-left">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Ajustes & Configuración de los Agentes</h2>
                <p className="text-xs text-slate-400">Modifica el comportamiento profundo de tus chatbots con prompts del sistema, temperatura y límites de cuota.</p>
              </div>

              <div className="space-y-6">
                {agents.map(agent => (
                  <div key={agent.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{agent.emoji}</span>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-100">{agent.name}</span>
                          <span className="text-[9px] text-slate-500">Modelo: {agent.model}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                          agent.status === "ACTIVE" ? "bg-emerald-950 text-emerald-400 border-emerald-800/30" : "bg-[#09090b] text-slate-500 border-zinc-800/30"
                        }`}>
                          {agent.status === "ACTIVE" ? "Activo" : "Inactivo"}
                        </span>
                        <button 
                          onClick={() => handleUpdateAgent(agent.id, { status: agent.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" })}
                          className="text-[10px] text-slate-300 hover:text-white bg-[#09090b] border border-zinc-900 px-2 py-1 rounded"
                        >
                          Toggle Estado
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Prompt */}
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Instrucción Base del Sistema (System Prompt)</label>
                        <textarea
                          rows={4}
                          value={agent.promptBase}
                          onChange={(e) => handleUpdateAgent(agent.id, { promptBase: e.target.value })}
                          className="w-full p-2.5 bg-[#09090b] border border-zinc-900 rounded-lg text-[11px] focus:outline-none focus:border-indigo-500 text-slate-200 leading-normal"
                        />
                      </div>

                      {/* Parameters */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                            <span>Temperatura</span>
                            <span className="text-indigo-400 font-mono">{agent.temperature}</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={agent.temperature}
                            onChange={(e) => handleUpdateAgent(agent.id, { temperature: Number(e.target.value) })}
                            className="w-full accent-indigo-600"
                          />
                          <p className="text-[8px] text-slate-500 leading-normal">Cerca a 0 para respuestas exactas; cerca a 1 para respuestas creativas.</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Límite Diario Mensajes</label>
                          <input 
                            type="number"
                            value={agent.dailyLimit}
                            onChange={(e) => handleUpdateAgent(agent.id, { dailyLimit: Number(e.target.value) })}
                            className="w-full h-8 px-2.5 bg-[#09090b] border border-zinc-900 rounded text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CHATS EN VIVO */}
          {activeTab === "conversations" && (
            <div className="space-y-4 animate-fadeIn h-[calc(100vh-170px)] flex flex-col text-left">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Inbox - Chats en Vivo</h2>
                <p className="text-xs text-slate-400">Revisa la interacción automática o interviene en tiempo real. Escribir un mensaje pausará la IA para este usuario.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden min-h-0">
                {/* Chat list */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-y-auto flex flex-col h-full">
                  <div className="p-3 border-b border-zinc-900">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 text-slate-500" size={13} />
                      <input 
                        type="text" 
                        placeholder="Buscar chat..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-3 text-xs bg-[#09090b] border border-zinc-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex-1 divide-y divide-zinc-900">
                    {conversations
                      .filter(c => c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || c.phoneNumber.includes(searchQuery))
                      .map(conv => (
                        <button
                          key={conv.id}
                          onClick={() => setActiveConversationId(conv.id)}
                          className={`w-full p-3 text-left transition-colors flex flex-col gap-1.5 ${
                            activeConversationId === conv.id ? "bg-[#09090b]" : "hover:bg-zinc-900/30"
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="font-semibold text-xs text-slate-200">{conv.customerName}</span>
                            <span className="text-[8px] text-slate-500 font-medium">{conv.time}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 truncate w-full">{conv.lastMessage}</span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[9px] text-slate-500 font-mono">{conv.phoneNumber}</span>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${
                                conv.status === "ACTIVE_IA" ? "bg-violet-950/60 text-violet-400 border border-violet-800/30" :
                                conv.status === "PAUSED" ? "bg-amber-950/60 text-amber-400 border border-amber-800/30" :
                                "bg-[#09090b] text-slate-500 border border-zinc-800/30"
                              }`}>
                                {conv.status === "ACTIVE_IA" ? "IA Activa" : conv.status === "PAUSED" ? "Pausado" : "Cerrado"}
                              </span>
                              <span className="text-[8px] text-slate-500 font-bold bg-[#09090b] px-1 py-0.5 rounded border border-zinc-800">
                                {conv.channel}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))
                    }
                  </div>
                </div>

                {/* Conversation Box */}
                <div className="md:col-span-2 bg-zinc-950 border border-zinc-900 rounded-xl flex flex-col overflow-hidden h-full">
                  {/* Header */}
                  <div className="p-3 border-b border-zinc-900 flex justify-between items-center bg-zinc-950">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-slate-200 text-xs">
                        {selectedConversation.customerName[0]}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-xs text-white">{selectedConversation.customerName}</span>
                        <span className="text-[9px] text-slate-500 font-mono">{selectedConversation.phoneNumber}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {selectedConversation.status === "PAUSED" && (
                        <button
                          onClick={() => handleReactivateIA(selectedConversation.id)}
                          className="h-7 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold flex items-center gap-1"
                        >
                          <Zap size={10} /> Reactivar IA
                        </button>
                      )}
                      <select 
                        value={selectedConversation.status} 
                        onChange={(e) => {
                          const nextStatus = e.target.value as Conversation["status"];
                          setConversations(prev => prev.map(c => c.id === selectedConversation.id ? { ...c, status: nextStatus } : c));
                          setCustomers(prev => prev.map(cust => cust.phone === selectedConversation.phoneNumber ? { ...cust, status: nextStatus } : cust));
                          showToast(`Estado de chat cambiado a ${nextStatus}`);
                        }}
                        className="h-7 px-2 bg-[#09090b] border border-zinc-900 rounded text-[10px] text-slate-300 focus:outline-none"
                      >
                        <option value="ACTIVE_IA">IA Activa</option>
                        <option value="PAUSED">Pausado (Agente)</option>
                        <option value="CLOSED">Cerrado</option>
                      </select>
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-950/20">
                    {selectedConversation.messages.map((msg) => {
                      if (msg.role === "system") {
                        return (
                          <div key={msg.id} className="flex justify-center my-1.5">
                            <span className="text-[9px] font-medium bg-[#09090b] border border-zinc-900 text-amber-500 px-3 py-1 rounded-full font-mono">
                              {msg.content}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[75%] rounded-xl p-2.5 text-xs text-left ${
                            msg.role === "user" 
                              ? "bg-[#09090b] border border-zinc-900 text-slate-200" 
                              : "bg-indigo-600 text-white font-medium"
                          }`}>
                            <p>{msg.content}</p>
                            <span className={`text-[8px] block text-right mt-1 opacity-70`}>{msg.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input */}
                  <form onSubmit={handleLiveChatSend} className="p-3 border-t border-zinc-900 bg-zinc-950 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Escribe respuesta manual para intervenir..."
                      value={liveChatInput}
                      onChange={(e) => setLiveChatInput(e.target.value)}
                      className="flex-1 h-9 px-3 text-xs bg-[#09090b] border border-zinc-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                    />
                    <button type="submit" className="h-9 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                      <Send size={12} /> Responder
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CATALOGO DE PRODUCTOS */}
          {activeTab === "products" && (
            <div className="space-y-4 animate-fadeIn text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-100">Catálogo de Productos</h2>
                  <p className="text-xs text-slate-400 font-medium">Los artículos listados aquí son cotizados de forma inteligente por la IA a tus clientes.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleSyncSheets} 
                    disabled={isSyncing}
                    className="h-8 px-3 bg-[#09090b] hover:bg-zinc-900 text-slate-300 border border-zinc-900 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                    Sincronizar Sheets
                  </button>
                  <button 
                    onClick={() => handleOpenProductModal(null)}
                    className="h-8 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus size={12} />
                    Nuevo Producto
                  </button>
                </div>
              </div>

              {/* Product list */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#09090b] border-b border-zinc-900 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                      <tr>
                        <th className="p-3.5">SKU</th>
                        <th className="p-3.5">Nombre</th>
                        <th className="p-3.5">Categoría</th>
                        <th className="p-3.5">Precio</th>
                        <th className="p-3.5">Stock</th>
                        <th className="p-3.5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-zinc-900/30 text-slate-300">
                          <td className="p-3.5 font-mono font-bold text-slate-400">{p.sku}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-6 h-6 rounded bg-zinc-800 object-cover" />}
                              <div className="flex flex-col text-left">
                                <span className="font-semibold text-slate-200">{p.name}</span>
                                <span className="text-[10px] text-slate-500 truncate max-w-sm">{p.description}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">{p.category}</td>
                          <td className="p-3.5 text-indigo-400 font-bold">{formatCurrency(p.price)}</td>
                          <td className="p-3.5">
                            <span className={`font-semibold px-2 py-0.5 rounded ${
                              p.stock > 10 ? "text-emerald-400 bg-emerald-950/20" : "text-amber-400 bg-amber-950/20"
                            }`}>
                              {p.stock} uds
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenProductModal(p)} className="p-1 hover:text-white text-slate-500 transition-colors">
                                <Edit2 size={13} />
                              </button>
                              <button onClick={() => handleDeleteProduct(p.id)} className="p-1 hover:text-red-500 text-slate-500 transition-colors">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add/Edit Modal (Mocked popup) */}
              {isProductModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                  <form onSubmit={handleSaveProduct} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 max-w-md w-full space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-white">{editingProduct ? "Editar Producto" : "Nuevo Producto"}</span>
                      <button type="button" onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">
                        <X size={15} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SKU</label>
                        <input 
                          type="text" 
                          placeholder="PRO-NEW-101"
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                          className="w-full h-8 px-2 bg-[#09090b] border border-zinc-900 rounded focus:outline-none focus:border-indigo-500 text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Categoría</label>
                        <input 
                          type="text" 
                          placeholder="Teclados"
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          className="w-full h-8 px-2 bg-[#09090b] border border-zinc-900 rounded focus:outline-none text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-bold">Nombre del Producto</label>
                      <input 
                        type="text" 
                        placeholder="Nombre comercial"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full h-8 px-2.5 bg-[#09090b] border border-zinc-900 rounded text-xs focus:outline-none focus:border-indigo-500 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Precio ({currency})</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                          className="w-full h-8 px-2 bg-[#09090b] border border-zinc-900 rounded focus:outline-none text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Stock</label>
                        <input 
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                          className="w-full h-8 px-2 bg-[#09090b] border border-zinc-900 rounded focus:outline-none text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Descripción para el chatbot</label>
                      <textarea 
                        rows={3} 
                        placeholder="Características clave que el bot usará para vender..."
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full p-2 bg-[#09090b] border border-zinc-900 rounded text-[11px] focus:outline-none text-slate-300"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsProductModalOpen(false)}
                        className="h-8 px-3 rounded border border-zinc-900 text-xs text-slate-400 hover:bg-zinc-900"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="h-8 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded"
                      >
                        {editingProduct ? "Actualizar" : "Guardar Producto"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB: INTEGRACIONES */}
          {activeTab === "integrations" && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Canales e Integraciones</h2>
                <p className="text-xs text-slate-400">Conecta tu chatbot a canales de mensajería (WhatsApp, Telegram) y alimenta tu catálogo desde Google Sheets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Google Sheets */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                      <FileSpreadsheet size={18} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs text-white">Google Sheets Catalog</span>
                      <span className="text-[10px] text-slate-500">Sincroniza tus productos e inventarios en vivo.</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">URL de Edición de Google Sheet</label>
                    <input 
                      type="text" 
                      placeholder="https://docs.google.com/spreadsheets/d/..." 
                      value={googleSheetUrl}
                      onChange={(e) => setGoogleSheetUrl(e.target.value)}
                      className="w-full h-8 px-2.5 bg-[#09090b] border border-zinc-900 rounded focus:outline-none focus:border-indigo-500 text-white"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[9px] text-slate-500 font-semibold">Última sincronización: Hoy</span>
                    <button 
                      onClick={handleSyncSheets}
                      className="h-8 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1.5"
                    >
                      <RefreshCw size={11} /> Sincronizar Catálogo
                    </button>
                  </div>
                </div>

                {/* WhatsApp Cloud API */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                      <Phone size={18} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs text-white">WhatsApp Cloud API</span>
                      <span className="text-[10px] text-slate-500">Conexión directa vía Meta developers.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Phone Number ID</label>
                      <input 
                        type="text" 
                        value={metaPhoneId}
                        onChange={(e) => setMetaPhoneId(e.target.value)}
                        className="w-full h-8 px-2.5 bg-[#09090b] border border-zinc-900 rounded focus:outline-none text-white font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Access Token</label>
                      <input 
                        type="password" 
                        value={metaAccessToken}
                        onChange={(e) => setMetaAccessToken(e.target.value)}
                        className="w-full h-8 px-2.5 bg-[#09090b] border border-zinc-900 rounded focus:outline-none text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={() => showToast("Credenciales de WhatsApp actualizadas.")}
                      className="h-8 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded"
                    >
                      Guardar Canales
                    </button>
                  </div>
                </div>

                {/* Telegram Bot */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                      <Send size={18} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs text-white">Telegram Bot API</span>
                      <span className="text-[10px] text-slate-500">Conecta tu chatbot de Telegram.</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bot Token API</label>
                    <input 
                      type="password" 
                      placeholder="123456789:ABCdefGh..."
                      value={telegramToken}
                      onChange={(e) => setTelegramToken(e.target.value)}
                      className="w-full h-8 px-2.5 bg-[#09090b] border border-zinc-900 rounded focus:outline-none text-white font-mono"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={() => showToast("Token de Telegram vinculado.")}
                      className="h-8 px-3 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded"
                    >
                      Vincular Bot
                    </button>
                  </div>
                </div>

                {/* Webhook Endpoint */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-500/10 text-slate-300 border border-slate-700 flex items-center justify-center">
                      <LinkIcon size={18} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs text-white">Webhook Endpoint</span>
                      <span className="text-[10px] text-slate-500">Consumo de webhooks externos.</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tu webhook de producción</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value="https://phronagents.com/api/webhooks/whatsapp" 
                        className="flex-1 h-8 px-2.5 bg-[#09090b] border border-zinc-850 rounded text-[10px] text-slate-400 font-mono select-all focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText("https://phronagents.com/api/webhooks/whatsapp");
                          showToast("¡Copiado al portapapeles!");
                        }}
                        className="h-8 px-2 bg-[#09090b] border border-zinc-900 rounded hover:bg-slate-800 text-[10px] text-slate-300"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: CLIENTES / LEADS */}
          {activeTab === "customers" && (
            <div className="space-y-4 animate-fadeIn text-left">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Clientes & Leads Capturados</h2>
                <p className="text-xs text-slate-400 font-medium">Listado de contactos recolectados de forma autónoma por la IA en los canales de atención.</p>
              </div>

              {/* Table wrapper */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                <div className="p-3 border-b border-zinc-900 flex justify-between items-center">
                  <div className="relative max-w-sm w-full">
                    <Search className="absolute left-2.5 top-2.5 text-slate-500" size={13} />
                    <input 
                      type="text" 
                      placeholder="Buscar por nombre o celular..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 text-xs bg-[#09090b] border border-zinc-900 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#09090b] border-b border-zinc-900 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                      <tr>
                        <th className="p-3.5">Nombre</th>
                        <th className="p-3.5">Celular</th>
                        <th className="p-3.5">Canal</th>
                        <th className="p-3.5">Registrado</th>
                        <th className="p-3.5">Último interés</th>
                        <th className="p-3.5">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/50">
                      {customers
                        .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery))
                        .map(c => (
                          <tr key={c.id} className="hover:bg-zinc-900/30 text-slate-300">
                            <td className="p-3.5 font-semibold text-slate-200">{c.name}</td>
                            <td className="p-3.5 font-mono text-slate-400">{c.phone}</td>
                            <td className="p-3.5">
                              <span className="text-[10px] bg-[#09090b] px-2 py-0.5 rounded border border-zinc-800 font-bold uppercase">
                                {c.channel}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-500">{c.createdAt}</td>
                            <td className="p-3.5 font-medium">{c.lastInterest}</td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                                c.status === "ACTIVE_IA" ? "bg-violet-950 text-violet-400 border-violet-900/30" :
                                c.status === "PAUSED" ? "bg-amber-950 text-amber-400 border-amber-900/30" :
                                "bg-[#09090b] text-slate-500 border-zinc-800/30"
                              }`}>
                                {c.status === "ACTIVE_IA" ? "IA Activa" : c.status === "PAUSED" ? "Asesor" : "Cerrado"}
                              </span>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONFIGURACIÓN */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto text-left">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Configuración Global de Organización</h2>
                <p className="text-xs text-slate-400 font-medium">Administra los parámetros generales del tenant de tu comercio.</p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nombre de la Organización</label>
                  <input 
                    type="text" 
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full h-8 px-2.5 bg-[#09090b] border border-zinc-900 rounded focus:outline-none focus:border-indigo-500 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-bold">Moneda del Comercio</label>
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-8 px-2 bg-[#09090b] border border-zinc-900 rounded focus:outline-none text-white text-xs"
                    >
                      <option value="USD">USD ($ - Dólar Estadounidense)</option>
                      <option value="BOB">BOB (Bs - Boliviano)</option>
                      <option value="ARS">ARS ($ - Peso Argentino)</option>
                      <option value="EUR">EUR (€ - Euro)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-bold font-bold">Idioma Predeterminado</label>
                    <select className="w-full h-8 px-2 bg-[#09090b] border border-zinc-900 rounded focus:outline-none text-white text-xs">
                      <option value="es">Español (ES)</option>
                      <option value="en">Inglés (EN)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg flex items-start gap-2.5 text-slate-400">
                  <Shield size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5 leading-normal text-left">
                    <span className="text-[10px] font-bold text-slate-200">Seguridad Multi-Tenant</span>
                    <p className="text-[9px]">Toda la configuración del catálogo, clientes e historial de chat está estrictamente segregada para la organización actual.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    onClick={() => showToast("Configuración general guardada.")}
                    className="h-8 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
