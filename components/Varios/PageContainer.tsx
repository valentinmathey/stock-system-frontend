// PageContainer.tsx
"use client";

import { Sidebar } from "@/components/Layout/Sidebar";
import { Topbar } from "@/components/Layout/Topbar";

type Props = {
  children: React.ReactNode;
  valorBusqueda: string;
  onBuscar: (valor: string) => void;
  showSearch?: boolean;        // <— nuevo prop opcional
};

export function PageContainer({
  children,
  valorBusqueda,
  onBuscar,
  showSearch = true,           // por defecto mostramos la búsqueda
}: Props) {
  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-50 overflow-y-auto">
        <Topbar
          valor={valorBusqueda}
          onBuscar={onBuscar}
          showSearch={showSearch}
        />
        <div className="p-6">{children}</div>
      </div>
    </main>
  );
}
