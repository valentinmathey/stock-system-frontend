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

export function Sidebar() {
  const pathname = usePathname();

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

      <div className="relative w-fit mx-auto mb-20 transition duration-300 hover:scale-102">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-200 text-2xl px-2 py-1 rounded-xs shadow">
          💡
        </div>

        <div className="bg-green-100 text-md p-4 rounded-xs text-center shadow">
          <p className="font-bold text-lg">Consejo de GESPRO </p>
          Recordá revisar el stock de artículos en punto de pedido.
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
