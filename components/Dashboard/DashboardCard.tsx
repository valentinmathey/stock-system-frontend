// components/Dashboard/DashboardCard.tsx
"use client";
import { ReactNode } from "react";

export function DashboardCard({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section
      className="group rounded-3xl bg-white shadow-lg ring-1 ring-black/5
                 p-6 flex flex-col gap-4 transition
                 hover:-translate-y-1 hover:shadow-2xl text-black"
    >
      <h3 className="text-lg font-bold tracking-tight text-gray-800
                     flex items-center gap-2 after:flex-1 after:h-px after:bg-gray-200">
        {titulo}
      </h3>

      {/* contenido */}
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}
