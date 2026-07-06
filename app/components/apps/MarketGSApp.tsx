"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart3,
  ShoppingCart,
  Package,
  ShoppingBag,
  History,
  Users,
  Settings,
  AlertTriangle,
  TrendingUp,
  FileText,
  Smartphone,
  BookOpen,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  PlusCircle,
  User,
  DollarSign,
  ArrowUpDown
} from "lucide-react";

// ==========================================
// MOCK DATA (Idénticos en estructura a los reales pero seguros)
// ==========================================

interface Product {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  color: string;
  colorHex: string;
  stock: number;
  stockDamaged: number;
  minStock: number;
  costPrice: number;
  retailPrice: number;
  material: string;
}

interface SaleItem {
  product: Product;
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  client: string;
  items: { productName: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: "Efectivo" | "Transferencia" | "Pago Móvil";
  date: string;
}

interface WalletMovement {
  id: string;
  type: "entrada" | "venta" | "salida";
  title: string;
  description: string;
  amount: number;
  date: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Funda Silicona MagSafe", type: "Funda", brand: "Apple", model: "iPhone 14 Pro Max", color: "Negro Mate", colorHex: "#1C1C1E", stock: 12, stockDamaged: 0, minStock: 5, costPrice: 4.5, retailPrice: 12.0, material: "Silicona" },
  { id: "2", name: "Funda Silicona MagSafe", type: "Funda", brand: "Apple", model: "iPhone 14 Pro Max", color: "Azul Sierra", colorHex: "#708090", stock: 3, stockDamaged: 1, minStock: 5, costPrice: 4.5, retailPrice: 12.0, material: "Silicona" },
  { id: "3", name: "Protector de Pantalla Cerámico", type: "Protector de Pantalla", brand: "Apple", model: "iPhone 15 Pro", color: "Transparente", colorHex: "#E5E7EB", stock: 25, stockDamaged: 0, minStock: 8, costPrice: 2.0, retailPrice: 7.0, material: "Vidrio Templado" },
  { id: "4", name: "Funda Alto Impacto Armor", type: "Funda", brand: "Samsung", model: "Galaxy S24 Ultra", color: "Titanio Gris", colorHex: "#8E8E93", stock: 8, stockDamaged: 0, minStock: 4, costPrice: 6.0, retailPrice: 15.0, material: "TPU Rígido" },
  { id: "5", name: "Funda Ringke Fusion", type: "Funda", brand: "Xiaomi", model: "Redmi Note 13", color: "Transparente", colorHex: "#E5E7EB", stock: 1, stockDamaged: 0, minStock: 3, costPrice: 3.5, retailPrice: 10.0, material: "Híbrido" },
  { id: "6", name: "Protector de Cámara Integrado", type: "Protector de Pantalla", brand: "Apple", model: "iPhone 13", color: "Negro", colorHex: "#000000", stock: 0, stockDamaged: 2, minStock: 5, costPrice: 1.5, retailPrice: 5.0, material: "Vidrio templado" },
];

const INITIAL_SALES: Sale[] = [
  { id: "s1", client: "Carlos Mendoza", items: [{ productName: "Funda Silicona iPhone 14 Pro Max (Negro)", quantity: 1, price: 12.0 }], total: 12.0, paymentMethod: "Efectivo", date: "Hace 5 mins" },
  { id: "s2", client: "Maria Alejandra", items: [{ productName: "Protector Cerámico iPhone 15 Pro", quantity: 2, price: 7.0 }, { productName: "Funda Alto Impacto Samsung S24 Ultra", quantity: 1, price: 15.0 }], total: 29.0, paymentMethod: "Pago Móvil", date: "Hace 1 hora" },
  { id: "s3", client: "Pedro Gomez", items: [{ productName: "Funda Ringke Fusion Xiaomi Redmi Note 13", quantity: 1, price: 10.0 }], total: 10.0, paymentMethod: "Transferencia", date: "Hace 4 horas" },
];

const INITIAL_MOVEMENTS: WalletMovement[] = [
  { id: "w1", type: "venta", title: "Venta registrada #s1", description: "Venta a Carlos Mendoza de 1x Funda Silicona iPhone 14 Pro Max", amount: 12.0, date: "Hace 5 mins" },
  { id: "w2", type: "venta", title: "Venta registrada #s2", description: "Venta a Maria Alejandra de 2x Protector Cerámico iPhone 15 Pro + 1x Funda S24 Ultra", amount: 29.0, date: "Hace 1 hora" },
  { id: "w3", type: "entrada", title: "Ingreso de Stock Manual", description: "Se añadieron 10 unidades de Protector Cerámico iPhone 15 Pro", amount: 20.0, date: "Hace 2 horas" },
  { id: "w4", type: "salida", title: "Baja por Daño", description: "Se reportó 1 unidad dañada de Funda Silicona iPhone 14 Pro Max (Azul)", amount: 4.5, date: "Hace 4 horas" },
];

export default function MarketGSApp() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "ventas-pos" | "ventas-historial" | "compras" | "inventario" | "inventario-productos" | "wallet" | "ajustes"
  >("dashboard");
  
  // Theme state local wrapper to match the exact black and white design of MarketGS
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Core App states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);
  const [movements, setMovements] = useState<WalletMovement[]>(INITIAL_MOVEMENTS);

  // States for interactive POS Flow
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [clientName, setClientName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Efectivo" | "Transferencia" | "Pago Móvil">("Efectivo");
  const [posSearch, setPosSearch] = useState("");
  const [posTypeFilter, setPosTypeFilter] = useState("todos");

  // States for Inventory view general and products list
  const [invSearch, setInvSearch] = useState("");
  const [invTypeFilter, setInvTypeFilter] = useState("todos");
  const [editingStockProduct, setEditingStockProduct] = useState<Product | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [newStockDamagedValue, setNewStockDamagedValue] = useState<number>(0);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Add Product Form
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("Funda");
  const [formBrand, setFormBrand] = useState("Apple");
  const [formModel, setFormModel] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formColorHex, setFormColorHex] = useState("#FFFFFF");
  const [formStock, setFormStock] = useState(10);
  const [formMinStock, setFormMinStock] = useState(3);
  const [formCost, setFormCost] = useState(4.0);
  const [formRetail, setFormRetail] = useState(10.0);
  const [formMaterial, setFormMaterial] = useState("Silicona");

  // Notification simulator
  const [notifications, setNotifications] = useState<string[]>([
    "Stock crítico detectado para Funda Ringke Fusion Xiaomi Redmi Note 13.",
    "El producto Protector de Cámara Integrado iPhone 13 no cuenta con existencias."
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const triggerFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Computations
  const stats = useMemo(() => {
    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
    const lowStockList = products.filter(p => p.stock <= p.minStock);
    const lowStockCount = lowStockList.length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
    const totalDamagedUnits = products.reduce((sum, p) => sum + p.stockDamaged, 0);

    return {
      revenue: totalSales,
      transactions: sales.length,
      totalProducts,
      inventoryValue: totalInventoryValue,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      totalUnits,
      totalDamagedUnits,
      lowStockList
    };
  }, [products, sales]);

  // POS Actions
  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      triggerFeedback(`❌ ${product.name} está agotado.`);
      return;
    }
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        triggerFeedback(`⚠️ Stock máximo alcanzado (${product.stock} unids).`);
        return;
      }
      setCart(cart.map(item =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, price: product.retailPrice }]);
    }
    triggerFeedback(`🛒 Añadido: ${product.name}`);
  };

  const updateCartQty = (productId: string, qty: number) => {
    const item = cart.find(c => c.product.id === productId);
    if (!item) return;
    if (qty <= 0) {
      setCart(cart.filter(c => c.product.id !== productId));
      return;
    }
    if (qty > item.product.stock) {
      triggerFeedback(`⚠️ Máximo disponible: ${item.product.stock} unids.`);
      return;
    }
    setCart(cart.map(c => c.product.id === productId ? { ...c, quantity: qty } : c));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const saleId = `s${sales.length + 1}`;
      const finalClient = clientName.trim() || "Consumidor Final";
      const total = cart.reduce((sum, i) => sum + (i.quantity * i.price), 0);

      const newSale: Sale = {
        id: saleId,
        client: finalClient,
        items: cart.map(i => ({
          productName: `${i.product.name} ${i.product.model}`,
          quantity: i.quantity,
          price: i.price
        })),
        total,
        paymentMethod,
        date: "Hoy, Justo ahora"
      };

      // Deduct Stock
      setProducts(products.map(p => {
        const cartItem = cart.find(c => c.product.id === p.id);
        return cartItem ? { ...p, stock: Math.max(0, p.stock - cartItem.quantity) } : p;
      }));

      // Add to Sales and Movements
      setSales([newSale, ...sales]);
      setMovements([
        {
          id: `w${movements.length + 1}`,
          type: "venta",
          title: `Venta registrada #${saleId}`,
          description: `Venta a ${finalClient} por Bs. ${total.toFixed(2)}`,
          amount: total,
          date: "Hoy, Justo ahora"
        },
        ...movements
      ]);

      setCart([]);
      setClientName("");
      setLoading(false);
      triggerFeedback(`🎉 Venta #${saleId} completada con éxito por Bs. ${total.toFixed(2)}`);
    }, 750);
  };

  // Add Product Action
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formModel) {
      triggerFeedback("⚠️ Nombre y Modelo son campos obligatorios.");
      return;
    }

    const newProd: Product = {
      id: `${products.length + 1}`,
      name: formName,
      type: formType,
      brand: formBrand,
      model: formModel,
      color: formColor || "Único",
      colorHex: formColorHex,
      stock: Number(formStock),
      stockDamaged: 0,
      minStock: Number(formMinStock),
      costPrice: Number(formCost),
      retailPrice: Number(formRetail),
      material: formMaterial
    };

    setProducts([newProd, ...products]);
    setShowAddProductModal(false);
    
    // Reset Form
    setFormName("");
    setFormModel("");
    setFormColor("");
    setFormStock(10);
    setFormMinStock(3);
    setFormCost(4.0);
    setFormRetail(10.0);

    triggerFeedback(`📦 Producto "${newProd.name} ${newProd.model}" agregado.`);
  };

  // Update Stock Action
  const handleUpdateStock = () => {
    if (!editingStockProduct) return;
    setProducts(products.map(p =>
      p.id === editingStockProduct.id
        ? { ...p, stock: newStockValue, stockDamaged: newStockDamagedValue }
        : p
    ));
    setEditingStockProduct(null);
    triggerFeedback("🔧 Existencias actualizadas con éxito.");
  };

  // Filtered lists
  const filteredPOSProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(posSearch.toLowerCase()) || p.model.toLowerCase().includes(posSearch.toLowerCase());
    const matchesType = posTypeFilter === "todos" ? true : p.type === posTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredInventoryProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(invSearch.toLowerCase()) || p.model.toLowerCase().includes(invSearch.toLowerCase());
    const matchesType = invTypeFilter === "todos" ? true : p.type === invTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className={`w-full h-full min-h-[580px] overflow-auto flex select-none font-sans transition-colors duration-200 ${
      isDarkMode ? "bg-black text-slate-100 dark" : "bg-white text-slate-900"
    }`}>
      
      {/* Dynamic Feedback Notification */}
      {feedback && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border shadow-2xl transition-all duration-300 animate-slide-in ${
          isDarkMode ? "bg-[#0f0f0f] border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200 text-black"
        }`}>
          <div className="text-xs font-bold font-mono tracking-wider">{feedback}</div>
        </div>
      )}

      {/* Sidebar container */}
      <aside className={`w-64 border-r shrink-0 flex flex-col justify-between p-4 transition-colors duration-200 ${
        isDarkMode ? "bg-black border-zinc-800/80 text-zinc-400" : "bg-zinc-50/50 border-zinc-200 text-zinc-600"
      }`}>
        <div>
          {/* Company Brand Logo & Header */}
          <div className="flex items-center gap-2.5 px-2 py-3 mb-6">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm tracking-tighter ${
              isDarkMode ? "bg-white text-black" : "bg-black text-white"
            }`}>
              GS
            </div>
            <div>
              <span className={`font-extrabold text-sm tracking-tight block ${isDarkMode ? "text-white" : "text-black"}`}>
                Market G/S
              </span>
              <span className="text-[10px] text-zinc-500 block font-mono">By: Ludwing</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 pb-2">Navegación</div>
            
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "dashboard"
                  ? isDarkMode ? "bg-zinc-900 text-white border border-zinc-800" : "bg-zinc-200 text-black font-semibold"
                  : "hover:bg-zinc-900/30 hover:text-zinc-100"
              }`}
            >
              <BarChart3 size={15} />
              Dashboard
            </button>

            {/* Ventas group */}
            <div className="pt-2">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 block mb-1">Ventas</span>
              <button
                onClick={() => setActiveTab("ventas-pos")}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === "ventas-pos"
                    ? isDarkMode ? "bg-zinc-900 text-white border border-zinc-800" : "bg-zinc-200 text-black font-semibold"
                    : "hover:bg-zinc-900/30 hover:text-zinc-100"
                }`}
              >
                <ShoppingCart size={14} />
                Punto de Venta (POS)
              </button>
              <button
                onClick={() => setActiveTab("ventas-historial")}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === "ventas-historial"
                    ? isDarkMode ? "bg-zinc-900 text-white border border-zinc-800" : "bg-zinc-200 text-black font-semibold"
                    : "hover:bg-zinc-900/30 hover:text-zinc-100"
                }`}
              >
                <History size={14} />
                Historial Ventas
              </button>
            </div>

            {/* Inventario Group */}
            <div className="pt-2">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 block mb-1">Inventario</span>
              <button
                onClick={() => setActiveTab("inventario")}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === "inventario"
                    ? isDarkMode ? "bg-zinc-900 text-white border border-zinc-800" : "bg-zinc-200 text-black font-semibold"
                    : "hover:bg-zinc-900/30 hover:text-zinc-100"
                }`}
              >
                <Package size={14} />
                Vista General
              </button>
              <button
                onClick={() => setActiveTab("inventario-productos")}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === "inventario-productos"
                    ? isDarkMode ? "bg-zinc-900 text-white border border-zinc-800" : "bg-zinc-200 text-black font-semibold"
                    : "hover:bg-zinc-900/30 hover:text-zinc-100"
                }`}
              >
                <Smartphone size={14} />
                Gestionar Productos
              </button>
            </div>

            {/* Wallet Group */}
            <div className="pt-2">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-2.5 block mb-1">Finanzas</span>
              <button
                onClick={() => setActiveTab("wallet")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all ${
                  activeTab === "wallet"
                    ? isDarkMode ? "bg-zinc-900 text-white border border-zinc-800" : "bg-zinc-200 text-black font-semibold"
                    : "hover:bg-zinc-900/30 hover:text-zinc-100"
                }`}
              >
                <History size={14} />
                Wallet & Caja
              </button>
            </div>
          </nav>
        </div>

        {/* User profile footer */}
        <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
          isDarkMode ? "bg-[#060606] border-zinc-900 text-zinc-400" : "bg-zinc-100 border-zinc-200 text-zinc-800"
        }`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
            isDarkMode ? "bg-zinc-800 text-white" : "bg-zinc-300 text-black"
          }`}>
            U
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold block truncate">Usuario Demo</span>
            <span className="text-[9px] text-zinc-500 block truncate">usuario@marketgs.com</span>
          </div>
        </div>
      </aside>

      {/* Workspace Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className={`h-14 border-b flex items-center justify-between px-6 shrink-0 transition-colors duration-200 ${
          isDarkMode ? "bg-black border-zinc-900" : "bg-white border-zinc-200"
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">Market GS</span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-bold text-zinc-400 capitalize">
              {activeTab.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isDarkMode ? "border-zinc-800 hover:bg-zinc-900 text-zinc-400" : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                }`}
              >
                <Bell size={14} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                )}
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-xl p-3 z-50 ${
                  isDarkMode ? "bg-[#090909] border-zinc-800 text-slate-100" : "bg-white border-zinc-200 text-zinc-800"
                }`}>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-800/80 mb-2">
                    Alertas Críticas ({notifications.length})
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n, idx) => (
                      <div key={idx} className="text-[10px] leading-relaxed text-orange-400 bg-orange-500/5 p-2 rounded-lg border border-orange-500/10">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light mode theme switch */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
                isDarkMode ? "border-zinc-800 hover:bg-zinc-900 text-zinc-400" : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
              }`}
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            
            <div className="h-4 w-px bg-zinc-800"></div>

            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Demo Activa
            </span>
          </div>
        </header>

        {/* Inner Scrollable Workspace Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">

          {/* ==========================================
              TAB: DASHBOARD
              ========================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Welcome box (replica from real dashboard/page.tsx) */}
              <div className={`p-6 rounded-xl border transition-colors ${
                isDarkMode ? "bg-[#050505] border-zinc-900 text-white" : "bg-zinc-50 border-zinc-200 text-black"
              }`}>
                <h2 className="text-xl font-extrabold tracking-tight">
                  ¡Bienvenido de nuevo 👋 a Market G/S!
                </h2>
                <p className={`text-xs mt-1.5 ${isDarkMode ? "text-zinc-500" : "text-zinc-600"}`}>
                  Sistema de gestión para fundas y protectores de pantalla Market G/S.
                </p>
              </div>

              {/* Key Metrics row (replica from real dashboard/page.tsx) */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Metric 1 */}
                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <div className="flex items-center justify-between pb-1.5">
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase">Ventas del Mes</span>
                    <DollarSign size={15} className="text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black">Bs. {stats.revenue.toLocaleString()}</div>
                  <p className="text-[10px] text-zinc-500 mt-1">{stats.transactions} transacciones hechas</p>
                </div>

                {/* Metric 2 */}
                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <div className="flex items-center justify-between pb-1.5">
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase">Total Productos</span>
                    <Package size={15} className="text-zinc-400" />
                  </div>
                  <div className="text-2xl font-black">{stats.totalProducts} tipos</div>
                  <p className="text-[10px] text-zinc-500 mt-1">En el inventario sano</p>
                </div>

                {/* Metric 3 */}
                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <div className="flex items-center justify-between pb-1.5">
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase">Valor Inventario</span>
                    <BarChart3 size={15} className="text-zinc-400" />
                  </div>
                  <div className="text-2xl font-black">Bs. {stats.inventoryValue.toLocaleString()}</div>
                  <p className="text-[10px] text-zinc-500 mt-1">Valor total de adquisición</p>
                </div>

                {/* Metric 4 */}
                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                } ${stats.lowStock > 0 ? "border-orange-500/20" : ""}`}>
                  <div className="flex items-center justify-between pb-1.5">
                    <span className="text-[11px] font-semibold text-zinc-500 uppercase">Stock Bajo</span>
                    <AlertTriangle size={15} className="text-orange-500" />
                  </div>
                  <div className={`text-2xl font-black ${stats.lowStock > 0 ? "text-orange-500" : ""}`}>
                    {stats.lowStock}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">{stats.outOfStock} agotados por completo</p>
                </div>
              </div>

              {/* Simulated visual charts */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <div className={`lg:col-span-2 p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Volumen de Ventas Diarias</h3>
                      <p className="text-[10px] text-zinc-500">Historial simulado del mes en curso</p>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">Total: Bs. {stats.revenue}</span>
                  </div>

                  <div className="h-44 flex items-end gap-1.5 pt-4">
                    {[35, 60, 45, 80, 50, 95, 75, 40, 65, 85, 110, 90, 130, 85].map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                        <div
                          className={`w-full rounded-t transition-all duration-300 ${
                            isDarkMode ? "bg-white group-hover:bg-zinc-200" : "bg-zinc-900 group-hover:bg-black"
                          }`}
                          style={{ height: `${(val / 140) * 100}%` }}
                        ></div>
                        <span className="text-[8px] font-mono text-zinc-600">{idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Metodología de Pago</h3>
                  
                  <div className="space-y-4">
                    {[
                      { name: "Efectivo", percent: "52%", count: "Bs. 240.00" },
                      { name: "Pago Móvil", percent: "35%", count: "Bs. 162.00" },
                      { name: "Transferencia", percent: "13%", count: "Bs. 60.00" },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-zinc-400">{item.name}</span>
                          <span className="font-bold">{item.percent} ({item.count})</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                          <div className={`h-full ${isDarkMode ? "bg-white" : "bg-zinc-950"}`} style={{ width: item.percent }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions Card Row */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <button
                  onClick={() => setActiveTab("ventas-pos")}
                  className={`p-5 rounded-xl border flex items-center justify-between text-left group transition-all ${
                    isDarkMode ? "bg-black border-zinc-900 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">Nueva Venta</h4>
                    <p className="text-[10px] text-zinc-500">Abrir punto de venta POS</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white border border-zinc-800">
                    <Plus size={15} />
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("inventario-productos");
                    setShowAddProductModal(true);
                  }}
                  className={`p-5 rounded-xl border flex items-center justify-between text-left group transition-all ${
                    isDarkMode ? "bg-black border-zinc-900 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">Nuevo Producto</h4>
                    <p className="text-[10px] text-zinc-500">Añadir ficha al inventario</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white border border-zinc-800">
                    <Package size={15} />
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("inventario")}
                  className={`p-5 rounded-xl border flex items-center justify-between text-left group transition-all ${
                    isDarkMode ? "bg-black border-zinc-900 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">Ver Inventario</h4>
                    <p className="text-[10px] text-zinc-500">Consultar stock disponible</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white border border-zinc-800">
                    <BarChart3 size={15} />
                  </div>
                </button>

                <button
                  onClick={() => triggerFeedback("📊 Generando reportes... Sincronizado.")}
                  className={`p-5 rounded-xl border flex items-center justify-between text-left group transition-all ${
                    isDarkMode ? "bg-black border-zinc-900 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">Reportes</h4>
                    <p className="text-[10px] text-zinc-500">Exportar estados financieros</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white border border-zinc-800">
                    <FileText size={15} />
                  </div>
                </button>
              </div>

              {/* Bottom Cards: Actividad Reciente & Productos Destacados */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5">Actividad Reciente</h3>
                  <div className="space-y-3">
                    {movements.slice(0, 4).map((m) => (
                      <div key={m.id} className="flex items-start justify-between text-xs pb-3 border-b border-zinc-900/50 last:border-0 last:pb-0">
                        <div className="flex gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            m.type === "venta" ? "bg-emerald-500" : m.type === "entrada" ? "bg-blue-500" : "bg-orange-500"
                          }`}></span>
                          <div>
                            <span className="font-bold text-white block">{m.title}</span>
                            <span className="text-[10px] text-zinc-500 block">{m.description}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 shrink-0">{m.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5">Productos Destacados</h3>
                  <div className="space-y-3">
                    {products.slice(0, 4).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between text-xs pb-2.5 border-b border-zinc-900/40 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-green-500" : idx === 2 ? "bg-orange-500" : "bg-purple-500"
                          }`}></span>
                          <div>
                            <span className="font-semibold block">{p.name} {p.model}</span>
                            <span className="text-[9px] text-zinc-500 block">Color: {p.color}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold block">Bs. {p.retailPrice.toFixed(2)}</span>
                          <span className="text-[9px] text-zinc-500 block">{p.stock} en stock</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB: PUNTO DE VENTA (POS)
              ========================================== */}
          {activeTab === "ventas-pos" && (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
              
              {/* Product selector catalog */}
              <div className={`lg:col-span-7 p-5 rounded-xl border flex flex-col space-y-4 ${
                isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900/60">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Catálogo de Productos</h2>
                    <p className="text-[10px] text-zinc-500">Agrega protectores y fundas al carrito</p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Buscar por nombre o modelo..."
                      value={posSearch}
                      onChange={(e) => setPosSearch(e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs w-44 focus:outline-none border ${
                        isDarkMode ? "bg-black border-zinc-800 text-white focus:border-zinc-500" : "bg-zinc-100 border-zinc-200 text-black focus:border-zinc-400"
                      }`}
                    />
                    <select
                      value={posTypeFilter}
                      onChange={(e) => setPosTypeFilter(e.target.value)}
                      className={`px-2 py-1 bg-black border text-xs rounded-lg focus:outline-none ${
                        isDarkMode ? "border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-black"
                      }`}
                    >
                      <option value="todos">Todos</option>
                      <option value="Funda">Fundas</option>
                      <option value="Protector de Pantalla">Vidrios/Protectores</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 overflow-y-auto max-h-[380px] pr-2">
                  {filteredPOSProducts.map((p) => {
                    const isOut = p.stock === 0;
                    return (
                      <div
                        key={p.id}
                        onClick={() => !isOut && addToCart(p)}
                        className={`p-3 rounded-lg border flex flex-col justify-between transition-all cursor-pointer ${
                          isOut
                            ? isDarkMode ? "bg-zinc-950/40 border-zinc-900 opacity-40 cursor-not-allowed" : "bg-zinc-100/50 border-zinc-200 opacity-50 cursor-not-allowed"
                            : isDarkMode ? "bg-black border-zinc-900 hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-400"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-zinc-500 font-mono">
                            <span>{p.type}</span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full border border-zinc-800" style={{ backgroundColor: p.colorHex }}></span>
                              {p.color}
                            </span>
                          </div>
                          <h3 className="text-xs font-bold mt-1 text-white">{p.name}</h3>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{p.model}</p>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-900/60">
                          <span className="font-extrabold text-white text-xs">Bs. {p.retailPrice.toFixed(2)}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isOut ? "bg-rose-500/10 text-rose-500" : p.stock <= p.minStock ? "bg-orange-500/10 text-orange-500" : "bg-emerald-500/10 text-emerald-500"
                          }`}>
                            {isOut ? "Agotado" : `Stock: ${p.stock}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Checkout Cart Summary */}
              <div className={`lg:col-span-5 p-5 rounded-xl border flex flex-col justify-between space-y-4 ${
                isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
              }`}>
                <div className="space-y-4">
                  <div className="pb-2 border-b border-zinc-900/60">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Carrito de Compra</h2>
                    <p className="text-[10px] text-zinc-500">Resumen de productos y totales</p>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Cliente</label>
                    <input
                      type="text"
                      placeholder="Consumidor Final"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                        isDarkMode ? "bg-black border-zinc-800 text-white focus:border-zinc-500" : "bg-zinc-100 border-zinc-200 text-black focus:border-zinc-400"
                      }`}
                    />
                  </div>

                  {/* Cart Items list */}
                  <div className="space-y-2 overflow-y-auto max-h-[170px] pr-1">
                    {cart.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-zinc-900 rounded-lg text-zinc-600 text-xs">
                        El carrito está vacío.
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.product.id} className="p-2.5 bg-black rounded-lg border border-zinc-900 flex items-center justify-between text-xs gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-white block truncate">{item.product.name}</span>
                            <span className="text-[9px] text-zinc-500 block">{item.product.model} • Bs. {item.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                              className="w-4 h-4 bg-zinc-800 text-white flex items-center justify-center rounded hover:bg-zinc-700 font-bold"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                              className="w-4 h-4 bg-zinc-800 text-white flex items-center justify-center rounded hover:bg-zinc-700 font-bold"
                            >
                              +
                            </button>
                            <button
                              onClick={() => updateCartQty(item.product.id, 0)}
                              className="w-5 h-5 text-rose-400 hover:text-rose-300 flex items-center justify-center ml-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-900/60 space-y-4">
                  {/* Pricing summary */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-zinc-500">
                      <span>Subtotal</span>
                      <span>Bs. {cart.reduce((s, i) => s + (i.quantity * i.price), 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-extrabold border-t border-zinc-900/60 pt-1.5">
                      <span>Total</span>
                      <span>Bs. {cart.reduce((s, i) => s + (i.quantity * i.price), 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment selector */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Método de Pago</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Efectivo", "Transferencia", "Pago Móvil"] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`py-1 text-center text-[10px] font-bold rounded-lg border transition-all ${
                            paymentMethod === method
                              ? isDarkMode ? "bg-white text-black border-white" : "bg-black text-white border-black"
                              : isDarkMode ? "bg-black text-zinc-500 border-zinc-850 hover:bg-zinc-900" : "bg-zinc-100 text-zinc-650 border-zinc-200 hover:bg-zinc-200"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Checkout trigger */}
                  <button
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      cart.length === 0
                        ? "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
                        : isDarkMode ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-900"
                    }`}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        Procesar Venta
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              TAB: HISTORIAL VENTAS
              ========================================== */}
          {activeTab === "ventas-historial" && (
            <div className={`p-5 rounded-xl border ${
              isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
            }`}>
              <div className="mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Bitácora de Ventas Procesadas</h3>
                <p className="text-[10px] text-zinc-500">Últimos registros de facturas emitidas por el sistema</p>
              </div>

              <div className="overflow-x-auto border border-zinc-900 rounded-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-900/50 border-b border-zinc-800/80">
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500">ID</th>
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500">Cliente</th>
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500">Productos vendidos</th>
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500">Metodología</th>
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-zinc-900/10 transition-colors">
                        <td className="p-3 font-mono font-bold">{sale.id}</td>
                        <td className="p-3 font-semibold">{sale.client}</td>
                        <td className="p-3 text-zinc-400">
                          {sale.items.map(i => `${i.quantity}x ${i.productName}`).join(", ")}
                        </td>
                        <td className="p-3 text-[10px] text-zinc-500">{sale.paymentMethod}</td>
                        <td className="p-3 text-right font-bold text-white font-mono">Bs. {sale.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: INVENTARIO (VISTA GENERAL)
              ========================================== */}
          {activeTab === "inventario" && (
            <div className="space-y-6">
              
              {/* Header metrics card list */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Modelos Activos</span>
                    <Package size={15} className="text-zinc-500" />
                  </div>
                  <div className="text-2xl font-black">{stats.totalProducts} tipos</div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{stats.totalUnits} unids. sanas en stock</p>
                </div>

                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Valor del Inventario (Costo)</span>
                    <DollarSign size={15} className="text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black">Bs. {stats.inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Valor FOB neto de adquisición</p>
                </div>

                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                } ${stats.lowStock > 0 ? "border-orange-500/20" : ""}`}>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Bajo Stock</span>
                    <AlertTriangle size={15} className="text-orange-500" />
                  </div>
                  <div className={`text-2xl font-black ${stats.lowStock > 0 ? "text-orange-500" : ""}`}>
                    {stats.lowStock} alertas
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Productos en stock mínimo o inferior</p>
                </div>

                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                } ${stats.outOfStock > 0 ? "border-rose-500/20" : ""}`}>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Agotados / Sin Stock</span>
                    <TrendingDown size={15} className="text-rose-500" />
                  </div>
                  <div className={`text-2xl font-black ${stats.outOfStock > 0 ? "text-rose-500" : ""}`}>
                    {stats.outOfStock} productos
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{stats.totalDamagedUnits} unids. reportadas como dañadas</p>
                </div>
              </div>

              {/* Bottom stock alerts */}
              <div className="grid gap-6 lg:grid-cols-2">
                
                <div className={`p-5 rounded-xl border flex flex-col justify-between ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <div className="pb-3 border-b border-zinc-900/60 mb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-orange-500" />
                        Alertas de Almacén
                      </h3>
                      <p className="text-[9px] text-zinc-500">Reponer existencias críticas en tienda</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("inventario-productos")}
                      className="text-[10px] text-white underline font-bold"
                    >
                      Editar Stock
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {stats.lowStockList.map((product) => (
                      <div key={product.id} className="flex justify-between items-center text-xs py-1 border-b border-zinc-900/30 last:border-0 pb-1">
                        <div>
                          <span className="font-bold text-white block">{product.name} {product.model}</span>
                          <span className="text-[9px] text-zinc-500 block">Color: {product.color} • Material: {product.material}</span>
                        </div>

                        <div className="text-right">
                          <span className={`font-mono font-bold block ${product.stock === 0 ? "text-rose-500" : "text-orange-500"}`}>
                            {product.stock} unids. (Mín: {product.minStock})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5">Últimos movimientos del almacén</h3>
                  
                  <div className="space-y-3">
                    {movements.map((mov) => (
                      <div key={mov.id} className="flex justify-between text-xs border-b border-zinc-900/50 pb-2.5 last:border-0 last:pb-0">
                        <div>
                          <span className="font-semibold block">{mov.title}</span>
                          <span className="text-[9px] text-zinc-500 block">{mov.description}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">{mov.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              TAB: GESTIONAR PRODUCTOS (INVENTARIO DETALLE)
              ========================================== */}
          {activeTab === "inventario-productos" && (
            <div className="space-y-6">
              
              {/* Search & Actions block */}
              <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
              }`}>
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <input
                    type="text"
                    placeholder="Buscar producto por nombre o modelo..."
                    value={invSearch}
                    onChange={(e) => setInvSearch(e.target.value)}
                    className={`px-3 py-1.5 text-xs rounded-lg focus:outline-none border flex-1 ${
                      isDarkMode ? "bg-black border-zinc-800 text-white focus:border-zinc-500" : "bg-zinc-100 border-zinc-200 text-black focus:border-zinc-400"
                    }`}
                  />
                  
                  <select
                    value={invTypeFilter}
                    onChange={(e) => setInvTypeFilter(e.target.value)}
                    className={`px-2 py-1 bg-black border text-xs rounded-lg focus:outline-none ${
                      isDarkMode ? "border-zinc-800 text-zinc-300" : "bg-zinc-100 border-zinc-200 text-black"
                    }`}
                  >
                    <option value="todos">Todos los Tipos</option>
                    <option value="Funda">Fundas</option>
                    <option value="Protector de Pantalla">Vidrios templados</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddProductModal(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isDarkMode ? "bg-white text-black hover:bg-zinc-200" : "bg-black text-white hover:bg-zinc-900"
                  }`}
                >
                  <Plus size={14} /> Registrar Producto
                </button>
              </div>

              {/* Editing Stock Helper Box */}
              {editingStockProduct && (
                <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Panel de Ajuste</span>
                    <h4 className="text-xs font-bold text-white">{editingStockProduct.name} {editingStockProduct.model}</h4>
                    <p className="text-[10px] text-zinc-400">Existencias actuales: {editingStockProduct.stock} sanas, {editingStockProduct.stockDamaged} dañadas</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 block">Sanas</span>
                      <input
                        type="number"
                        min="0"
                        value={newStockValue}
                        onChange={(e) => setNewStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 px-2 py-1 bg-black border border-zinc-800 rounded text-xs text-center text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-zinc-500 block">Dañadas</span>
                      <input
                        type="number"
                        min="0"
                        value={newStockDamagedValue}
                        onChange={(e) => setNewStockDamagedValue(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 px-2 py-1 bg-black border border-zinc-800 rounded text-xs text-center text-white focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-1.5 pt-4">
                      <button
                        onClick={handleUpdateStock}
                        className="bg-white text-black font-bold text-[10px] px-2.5 py-1 rounded transition-all hover:bg-zinc-200"
                      >
                        Aplicar
                      </button>
                      <button
                        onClick={() => setEditingStockProduct(null)}
                        className="bg-zinc-800 text-zinc-300 text-[10px] px-2.5 py-1 rounded transition-all hover:bg-zinc-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Table replica of inventory table */}
              <div className={`border rounded-xl overflow-hidden ${
                isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
              }`}>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-900/40 border-b border-zinc-800/80">
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500">Producto</th>
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500">Modelo / Color</th>
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500">Existencias</th>
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500 text-right">Costos y Precios</th>
                      <th className="p-3 text-[10px] uppercase font-bold text-zinc-500 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {filteredInventoryProducts.map((p) => {
                      const isLow = p.stock <= p.minStock;
                      const isOut = p.stock === 0;

                      return (
                        <tr key={p.id} className="hover:bg-zinc-900/10 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-white block">{p.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">Tipo: {p.type} • Mat: {p.material}</span>
                          </td>
                          <td className="p-3">
                            <span className="block">{p.model}</span>
                            <span className="text-[9px] text-zinc-500 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full border border-zinc-800" style={{ backgroundColor: p.colorHex }}></span>
                              {p.color}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`font-bold font-mono block ${isOut ? "text-rose-500" : isLow ? "text-orange-500" : "text-emerald-500"}`}>
                              {p.stock} unids. sanas
                            </span>
                            <span className="text-[10px] text-zinc-500 block">Dañadas: {p.stockDamaged} (Mín: {p.minStock})</span>
                          </td>
                          <td className="p-3 text-right">
                            <span className="text-[10px] text-zinc-500 block">Costo: Bs. {p.costPrice.toFixed(2)}</span>
                            <span className="font-bold font-mono block">Venta: Bs. {p.retailPrice.toFixed(2)}</span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setEditingStockProduct(p);
                                setNewStockValue(p.stock);
                                setNewStockDamagedValue(p.stockDamaged);
                              }}
                              className="text-[11px] underline font-bold hover:text-white"
                            >
                              Modificar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add Product Modal Overlay simulator */}
              {showAddProductModal && (
                <div className={`p-6 rounded-xl border ${
                  isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-white border-zinc-200 text-black"
                }`}>
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-900 mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Registrar Nuevo Producto</h3>
                    <button onClick={() => setShowAddProductModal(false)} className="text-zinc-500 hover:text-white">✕</button>
                  </div>

                  <form onSubmit={handleAddProduct} className="grid gap-4 grid-cols-1 sm:grid-cols-2 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Descripción básica *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Funda Silicona MagSafe"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-zinc-100 border-zinc-200 text-black"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Tipo de Accesorio</label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full px-2 py-1.5 bg-black border border-zinc-850 rounded-lg text-xs"
                      >
                        <option value="Funda">Funda</option>
                        <option value="Protector de Pantalla">Protector de Pantalla (Vidrio)</option>
                        <option value="Cargador">Cargador</option>
                        <option value="Audífonos">Audífonos</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Modelo de Teléfono *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: iPhone 15 Pro Max"
                        value={formModel}
                        onChange={(e) => setFormModel(e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-zinc-100 border-zinc-200 text-black"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Color (Nombre)</label>
                      <input
                        type="text"
                        placeholder="Ej: Titanio Natural"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-zinc-100 border-zinc-200 text-black"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Color Hex (Visualizer)</label>
                      <input
                        type="color"
                        value={formColorHex}
                        onChange={(e) => setFormColorHex(e.target.value)}
                        className="w-full h-8 bg-black border border-zinc-850 rounded-lg focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Material</label>
                      <input
                        type="text"
                        placeholder="Ej: Silicona, Vidrio, TPU"
                        value={formMaterial}
                        onChange={(e) => setFormMaterial(e.target.value)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-zinc-100 border-zinc-200 text-black"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Stock Inicial</label>
                      <input
                        type="number"
                        value={formStock}
                        onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-zinc-100 border-zinc-200 text-black"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Stock Mínimo Alerta</label>
                      <input
                        type="number"
                        value={formMinStock}
                        onChange={(e) => setFormMinStock(parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-zinc-100 border-zinc-200 text-black"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Costo Unitario (Bs.)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formCost}
                        onChange={(e) => setFormCost(parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-zinc-100 border-zinc-200 text-black"
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-zinc-500">Precio de Venta (Bs.)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formRetail}
                        onChange={(e) => setFormRetail(parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-1.5 text-xs rounded-lg focus:outline-none border ${
                          isDarkMode ? "bg-black border-zinc-800 text-white" : "bg-zinc-100 border-zinc-200 text-black"
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2 pt-3 border-t border-zinc-900 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddProductModal(false)}
                        className="px-4 py-1.5 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-white text-black hover:bg-zinc-200 font-bold rounded-lg"
                      >
                        Crear Ficha
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              TAB: CAJA / WALLET
              ========================================== */}
          {activeTab === "wallet" && (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
              
              {/* Wallet balances log */}
              <div className={`lg:col-span-2 p-5 rounded-xl border ${
                isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
              }`}>
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-900/60">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Libro de Operaciones Diarias</h3>
                    <p className="text-[10px] text-zinc-500">Bitácora completa de ingresos y salidas del turno</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-zinc-500">Total en Turno</span>
                    <span className="text-base font-bold block text-white font-mono">Bs. {stats.revenue.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {movements.map((mov) => (
                    <div key={mov.id} className="p-3 bg-black rounded-lg border border-zinc-900 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{mov.title}</span>
                        <span className="text-[10px] text-zinc-500 block">{mov.description}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold block ${
                          mov.type === "venta" || mov.type === "entrada" ? "text-emerald-500" : "text-rose-500"
                        }`}>
                          {mov.type === "venta" || mov.type === "entrada" ? "+" : "-"}Bs. {mov.amount.toFixed(2)}
                        </span>
                        <span className="text-[9px] text-zinc-500 block">{mov.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick statistics calculator */}
              <div className={`p-5 rounded-xl border flex flex-col justify-between ${
                isDarkMode ? "bg-[#050505] border-zinc-900" : "bg-white border-zinc-200"
              }`}>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Resumen de Turno</h3>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-zinc-900/60 text-zinc-400">
                      <span>Ventas registradas</span>
                      <span>{sales.length}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-900/60 text-zinc-400">
                      <span>Promedio por venta</span>
                      <span>Bs. {(stats.revenue / (sales.length || 1)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-900/60 text-zinc-400">
                      <span>Existencias vendidas</span>
                      <span>{sales.reduce((sum, s) => sum + s.items.reduce((s2, i) => s2 + i.quantity, 0), 0)} unids.</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900/60">
                  <button
                    onClick={() => triggerFeedback("🔒 Turno de Caja Cerrado e Impreso.")}
                    className="w-full py-2 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-lg transition-all"
                  >
                    Cierre de Caja (Z)
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
