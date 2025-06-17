// components/Dashboard/DashboardResumen.tsx
"use client";

import {
  Box,
  TriangleAlert,
  ShieldAlert,
  FileClock,
  DollarSign,
} from "lucide-react";

interface DashboardResumenProps {
  totalArticulos: number;
  bajoPuntoPedido: number;
  enStockSeguridad: number;
  ordenesPendientes: number;
  ultimaVenta: string;            
}

export function DashboardResumen({
  totalArticulos,
  bajoPuntoPedido,
  enStockSeguridad,
  ordenesPendientes,
  ultimaVenta,
}: DashboardResumenProps) {
  const tarjetas = [
    {
      icono: Box,
      label: "Total de artículos",
      valor: totalArticulos,
      bg: "#A5F7E1",
    },
    {
      icono: TriangleAlert,
      label: "Bajo punto de pedido",
      valor: bajoPuntoPedido,
      bg: "#FEE5A5",
    },
    {
      icono: ShieldAlert,
      label: "En stock de seguridad",
      valor: enStockSeguridad,
      bg: "#F2A7A7",
    },
    {
      icono: FileClock,
      label: "OC pendientes",
      valor: ordenesPendientes,
      bg: "#AAA7F2",
    },
    {
      icono: DollarSign,
      label: "Última venta",
      valor: ultimaVenta,
      bg: "#B1F2A7",
    },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {tarjetas.map(({ icono: Icon, label, valor, bg }) => (
        <div
          key={label}
          className="flex items-center gap-4 p-4 rounded-xl shadow text-black"
          style={{ backgroundColor: bg }}
        >
          <div className="bg-white rounded-full p-2 shadow">
            <Icon size={18} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide">{label}</p>
            <p className="text-xl font-bold">{valor}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
