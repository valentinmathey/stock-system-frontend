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
    { icono: Box,          label: "Total de artículos",   valor: totalArticulos,  color: "#A5F7E1" },
    { icono: TriangleAlert,label: "Bajo punto de pedido", valor: bajoPuntoPedido, color: "#FEE5A5" },
    { icono: ShieldAlert,  label: "En stock de seguridad",valor: enStockSeguridad,color: "#F2A7A7" },
    { icono: FileClock,    label: "OC pendientes",        valor: ordenesPendientes,color: "#AAA7F2" },
    { icono: DollarSign,   label: "Última venta",         valor: ultimaVenta,     color: "#B1F2A7" },
  ] as const;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {tarjetas.map(({ icono: Icon, label, valor, color }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl p-5 shadow-xl
                     transition duration-200 ease-out
                     hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"
          style={{ backgroundColor: color }}
        >
          {/* capa para oscurecer en hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition duration-200" />

          {/* contenido */}
          <div className="relative flex items-center gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-full p-2 shadow-md">
              <Icon size={24} className="text-gray-800" />
            </div>

            <div className="text-gray-800">
              <p className="text-sm font-semibold uppercase tracking-wide">
                {label}
              </p>
              <p className="text-3xl font-extrabold leading-tight">
                {valor}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
