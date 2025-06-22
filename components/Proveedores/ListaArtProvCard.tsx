"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import EditarRelArtProv, { RelacionAP } from "./EditarRelacionProveedor";

/* ------------ tipos ------------ */
type Rel = {
  id: number;
  modeloInventario: "LOTE_FIJO" | "TIEMPO_FIJO";
  costoPedido: number;
  costoCompraUnitarioArticulo: number;
  demoraEntregaProveedor: number;
  tiempoRevision?: number;
  proximaFechaRevision?: string;
  articulo: { id: number; nombreArticulo: string };
};

export default function ListaArtProvCard({
  proveedorId,
  nombreProveedor,
  cerrar,
}: {
  proveedorId: number;
  nombreProveedor: string;
  cerrar: () => void;
}) {
  const [rels, setRels] = useState<Rel[]>([]);
  const [relSel, setRelSel] = useState<Rel | null>(null);

  const cargar = () =>
    fetch(
      `http://localhost:3000/articulos-proveedores/por-proveedor/${proveedorId}`
    )
      .then((r) => (r.ok ? r.json() : []))
      .then(setRels)
      .catch(() => setRels([]));

  useEffect(() => {
    void cargar(); 
  }, [proveedorId]);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center text-black">
        <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Artículos de “{nombreProveedor}”
          </h2>

          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-3 py-2">Artículo</th>
                <th className="px-3 py-2">Modelo</th>
                <th className="px-3 py-2">Costo pedido</th>
                <th className="px-3 py-2">Costo unitario</th>
                <th className="px-3 py-2">Demora (d)</th>
                <th className="px-3 py-2">Tiempo rev. (d)</th>
                <th className="px-3 py-2">Próx. rev.</th>
                <th className="px-3 py-2 text-center"> </th>
              </tr>
            </thead>
            <tbody>
              {rels.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="px-3 py-2">{r.articulo.nombreArticulo}</td>
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
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => setRelSel(r)}
                      className="text-violet-600 hover:text-violet-800"
                      title="Editar relación"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {rels.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-6">
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

      {/* popup de edición */}
      {relSel && (
        <EditarRelArtProv
          rel={relSel as unknown as RelacionAP}
          cerrar={() => setRelSel(null)}
          alGuardar={cargar}
        />
      )}
    </>
  );
}
