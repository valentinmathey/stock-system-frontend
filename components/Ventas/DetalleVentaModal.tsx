"use client";

import { useEffect, useState } from "react";

type Articulo = {
  id: number;
  nombreArticulo: string;
};

type Detalle = {
  id: number;
  cantidadArticulo: number;
  precioVentaUnitarioArticulo: number;
  ventaSubtotal: number;
  articulo: Articulo;
};

type VentaConDetalles = {
  id: number;
  fechaVenta: string;
  ventaTotal: number;
  detallesVenta: Detalle[];
};

type Props = {
  ventaId: number;
  cerrar: () => void;
};

export default function DetalleVentaModal({ ventaId, cerrar }: Props) {
  const [venta, setVenta] = useState<VentaConDetalles | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/ventas/${ventaId}`)
      .then((res) => res.json())
      .then(setVenta)
      .catch(() => alert("Error al cargar la venta"))
      .finally(() => setLoading(false));
  }, [ventaId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">Cargando...</div>
      </div>
    );
  }

  if (!venta) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-lg text-gray-800 font-semibold mb-2">
          Detalle de venta #{venta.id}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Fecha: {venta.fechaVenta} — Total: ${venta.ventaTotal.toFixed(2)}
        </p>

        <table className="w-full text-sm text-left border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 font-semibold">
            <tr>
              <th className="px-3 py-2 text-center">Artículo</th>
              <th className="px-3 py-2 text-center">Cantidad</th>
              <th className="px-3 py-2 text-center">Precio unit.</th>
              <th className="px-3 py-2 text-center">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venta.detallesVenta.map((d) => (
              <tr key={d.id} className="border-t text-gray-800 even:bg-gray-50">
                <td className="px-3 py-1 text-center">{d.articulo.nombreArticulo}</td>
                <td className="px-3 py-1 text-center">{d.cantidadArticulo}</td>
                <td className="px-3 py-1 text-center">
                  ${d.precioVentaUnitarioArticulo.toFixed(2)}
                </td>
                <td className="px-3 py-1 text-center">
                  ${d.ventaSubtotal.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right">
          <button
            onClick={cerrar}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
