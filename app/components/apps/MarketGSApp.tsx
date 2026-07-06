"use client";

import {
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

/** Market GS — ERP de Inventario (Terminado) */
export default function MarketGSApp() {
  const stats = [
    { label: "Productos", value: "1,247", icon: Package, color: "#4CAF50" },
    { label: "Ventas Hoy", value: "Bs. 3,450", icon: DollarSign, color: "#2196F3" },
    { label: "Crecimiento", value: "+12.5%", icon: TrendingUp, color: "#FF9800" },
    { label: "Stock Bajo", value: "8", icon: AlertTriangle, color: "#F44336" },
  ];

  const mockProducts = [
    { code: "ACC-001", name: "Funda iPhone 15 Pro", stock: 45, price: "Bs. 35", category: "Fundas" },
    { code: "ACC-002", name: "Cable USB-C 2m", stock: 120, price: "Bs. 15", category: "Cables" },
    { code: "ACC-003", name: "Audífonos Bluetooth", stock: 3, price: "Bs. 85", category: "Audio" },
    { code: "ACC-004", name: "Vidrio Templado S24", stock: 67, price: "Bs. 20", category: "Protectores" },
    { code: "ACC-005", name: "Cargador Rápido 25W", stock: 28, price: "Bs. 45", category: "Cargadores" },
    { code: "ACC-006", name: "Soporte Auto Magnético", stock: 5, price: "Bs. 55", category: "Soportes" },
    { code: "ACC-007", name: "Power Bank 10000mAh", stock: 15, price: "Bs. 120", category: "Baterías" },
    { code: "ACC-008", name: "Mouse Inalámbrico", stock: 0, price: "Bs. 65", category: "Periféricos" },
  ];

  return (
    <div className="p-4" style={{ fontFamily: "Tahoma, sans-serif", fontSize: "12px" }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <ShoppingCart size={20} color="#4CAF50" />
        <h1 className="text-[16px] font-bold m-0">Market GS — Panel de Control</h1>
        <div
          className="ml-auto px-2 py-[2px] text-[10px] font-bold text-white"
          style={{ background: "#4CAF50" }}
        >
          ✅ PRODUCCIÓN
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3 mb-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex-1 win2k-raised p-2"
              style={{ background: "#ECE9D8" }}
            >
              <div className="flex items-center gap-1 mb-1">
                <Icon size={14} color={stat.color} />
                <span className="text-[10px] text-[#808080]">{stat.label}</span>
              </div>
              <div className="text-[14px] font-bold">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Inventory Table */}
      <div className="win2k-sunken" style={{ background: "#FFFFFF" }}>
        <table className="w-full text-[11px]" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0A246A", color: "#FFFFFF" }}>
              <th className="text-left p-1 font-normal">Código</th>
              <th className="text-left p-1 font-normal">Producto</th>
              <th className="text-left p-1 font-normal">Categoría</th>
              <th className="text-center p-1 font-normal">Stock</th>
              <th className="text-right p-1 font-normal">Precio</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((prod, i) => (
              <tr
                key={prod.code}
                style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F0F0F0" }}
                className="hover:bg-[#0A246A] hover:text-white cursor-pointer"
              >
                <td className="p-1 font-mono text-[10px]">{prod.code}</td>
                <td className="p-1">{prod.name}</td>
                <td className="p-1">{prod.category}</td>
                <td className="p-1 text-center">
                  <span
                    className={`px-1 ${
                      prod.stock === 0
                        ? "bg-[#F44336] text-white"
                        : prod.stock <= 5
                        ? "bg-[#FF9800] text-white"
                        : ""
                    }`}
                  >
                    {prod.stock}
                  </span>
                </td>
                <td className="p-1 text-right">{prod.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
