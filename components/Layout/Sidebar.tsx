"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Handshake,
  FileText,
  ArrowRightLeft,
} from "lucide-react";
import { useEffect, useState } from "react";

export const frasesSidebar = [
  "Recordá revisar el stock de artículos en punto de pedido",
  "Verificá que los proveedores estén activos antes de cargar una orden",
  "Las ventas descuentan stock automáticamente",
  "No olvides actualizar el costo de almacenamiento si varía",
  "El lote óptimo ayuda a reducir costos logísticos",
  "Mantené la información del proveedor siempre actualizada",
  "Las órdenes de compra no afectan el stock hasta su recepción",
  "El punto de pedido se calcula en base a la demanda y la demora",
  "El stock de seguridad evita quiebres por incertidumbre",
  "Podés dar de baja artículos o proveedores si ya no se usan",
  "Verificá el historial de ventas para mejorar la previsión",
  "La demanda anual influye en la planificación de compras",
  "Podés agregar múltiples artículos en una sola orden",
  "Las ventas no se pueden registrar con stock insuficiente",
  "La fecha de baja no elimina registros, solo los oculta",
];

export function Sidebar() {
  const pathname = usePathname();

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prev) => (prev + 1) % frasesSidebar.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <aside className="w-70 h-screen bg-white shadow-md p-4 flex flex-col justify-between text-black">
      <div>
        <h2 className="text-2xl font-bold mb-8">GESPRO</h2>
        <nav className="space-y-4">
          <SidebarItem
            label="Dashboard"
            icon={<LayoutDashboard />}
            href="/dashboard"
            activo={pathname.startsWith("/dashboard")}
          />
          <SidebarItem
            label="Proveedores"
            icon={<Handshake />}
            href="/proveedores"
            activo={pathname.startsWith("/proveedores")}
          />
          <SidebarItem
            label="Artículos"
            icon={<Package />}
            href="/articulos"
            activo={pathname.startsWith("/articulos")}
          />
          <SidebarItem
            label="Órdenes de compra"
            icon={<FileText />}
            href="/ordenesdecompra"
            activo={pathname.startsWith("/ordenesdecompra")}
          />
          <SidebarItem
            label="Ventas"
            icon={<ArrowRightLeft />}
            href="/ventas"
            activo={pathname.startsWith("/ventas")}
          />
        </nav>
      </div>

      <div className="relative w-fit mx-auto mb-20">
        {/* Ícono flotante 💡 */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-green-200 text-2xl px-2 py-1 rounded-full shadow">
          💡
        </div>

        {/* Caja del consejo */}
        <div className="bg-green-100 text-sm p-4 rounded shadow text-center transition-transform duration-300 hover:scale-[1.01] z-0 relative mt-2">
          <p className="font-bold text-lg mb-1 mt-2">Consejo de GESPRO</p>
          <p className="text-gray-800 min-h-[55px]">{frasesSidebar[index]}</p>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  label,
  icon,
  href,
  activo = false,
}: {
  label: string;
  icon: React.ReactNode;
  href: string;
  activo?: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition ${
          activo
            ? "bg-violet-100 text-violet-600 font-semibold"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        {icon}
        <span>{label}</span>
      </div>
    </Link>
  );
}
