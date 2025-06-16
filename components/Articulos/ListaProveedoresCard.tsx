"use client";

import { useEffect, useState } from "react";

type Relacion = {
  id: number;
  modeloInventario: string;
  costoPedido: number;
  costoCompraUnitarioArticulo: number;
  demoraEntregaProveedor: number;
  tiempoRevision?: number;
  proximaFechaRevision?: string; // ISO
  proveedor: { id: number; nombreProveedor: string };
};

export default function ListaProveedoresCard({
  articuloId,
  nombreArticulo,
  cerrar,
}: {
  articuloId: number;
  nombreArticulo: string;
  cerrar: () => void;
}) {
  const [relaciones, setRelaciones] = useState<Relacion[]>([]);

  useEffect(() => {
    fetch(
      `http://localhost:3000/articulos-proveedores/por-articulo/${articuloId}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRelaciones(data);
        } else {
          console.warn("Respuesta inesperada:", data);
          setRelaciones([]);
        }
      })
      .catch((err) => {
        console.error("Error al cargar relaciones:", err);
        setRelaciones([]);
      });
  }, [articuloId]);

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Proveedores de “{nombreArticulo}”
        </h2>

        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-3 py-2">Proveedor</th>
              <th className="px-3 py-2">Modelo</th>
              <th className="px-3 py-2">Costo pedido</th>
              <th className="px-3 py-2">Costo unitario</th>
              <th className="px-3 py-2">Demora (d)</th>
              <th className="px-3 py-2">Tiempo rev. (d)</th>
              <th className="px-3 py-2">Próx. rev.</th>
            </tr>
          </thead>
          <tbody>
            {relaciones.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="px-3 py-2">{r.proveedor.nombreProveedor}</td>
                <td className="px-3 py-2">{r.modeloInventario}</td>
                <td className="px-3 py-2">${r.costoPedido.toFixed(2)}</td>
                <td className="px-3 py-2">
                  ${r.costoCompraUnitarioArticulo.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-center">
                  {r.demoraEntregaProveedor}
                </td>
                <td className="px-3 py-2 text-center">
                  {r.tiempoRevision ?? "—"}
                </td>
                <td className="px-3 py-2 text-center">
                  {r.proximaFechaRevision
                    ? new Date(r.proximaFechaRevision).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}

            {relaciones.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  Sin relaciones registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="text-right mt-6">
          <button
            onClick={cerrar}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
