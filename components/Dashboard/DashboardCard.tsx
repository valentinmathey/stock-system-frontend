"use client";

import { PropsWithChildren } from "react";

interface DashboardCardProps extends PropsWithChildren {
  /** Título que aparece arriba de la tarjeta */
  titulo: string;
}

export function DashboardCard({ titulo, children }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-black">
      <h3 className="text-lg font-semibold mb-2">{titulo}</h3>

      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
