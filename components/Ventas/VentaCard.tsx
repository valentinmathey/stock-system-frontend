"use client";

import { useState } from "react";
import VentaActions from "./VentaActions";
import DetalleVentaModal from "./DetalleVentaModal";

type Venta = {
  id: number;
  fechaVenta: string;
  ventaTotal: number;
};

type Props = {
  ventas: Venta[];
};

export function VentaCard({ ventas }: Props) {
  const [ventaSel, setVentaSel] = useState<Venta | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto rounded shadow bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3 text-center">Código</th>
              <th className="px-4 py-3 text-center">Fecha</th>
              <th className="px-4 py-3 text-center">Total ($)</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{v.id}</td>
                <td className="px-4 py-2 text-center">{v.fechaVenta}</td>
                <td className="px-4 py-2 text-center">
                  ${v.ventaTotal.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  <VentaActions onVerDetalle={() => setVentaSel(v)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ventaSel && (
        <DetalleVentaModal
          ventaId={ventaSel.id}
          cerrar={() => setVentaSel(null)}
        />
      )}
    </>
  );
}
