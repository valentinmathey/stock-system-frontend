"use client";

import { useState } from "react";
import { ModificarOrdenCompra } from "./ModificarOrdenCompra";
import OrdenCompraActions from "./OrdenCompraActions";
import DetalleOrdenCompraModal from "./DetalleOrdenCompraModal";

type EstadoOrdenCompra = {
  id: number;
  codigoEstadoOrdenCompra: string;
  nombreEstadoOrdenCompra: string;
  fechaBajaEstadoOrdenCompra: string | null;
};

type OrdenCompra = {
  id: number;
  fechaOrdenCompra: string;
  proveedor: { nombreProveedor: string };
  costoPedidoTotal: number;
  costoCompraTotal: number;
  costoTotal: number;
  estado: EstadoOrdenCompra;
};

type Props = {
  ordenes: OrdenCompra[];
  alGuardar: () => void;
};

export function OrdenDeCompraCard({ ordenes, alGuardar }: Props) {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<number | null>(
    null
  );
  const [verDetalleId, setVerDetalleId] = useState<number | null>(null);

  return (
    <div className="w-full overflow-x-auto rounded shadow bg-white">
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3 text-center">Código</th>
              <th className="px-4 py-3 text-center">Fecha</th>
              <th className="px-4 py-3 text-center">Proveedor</th>
              <th className="px-4 py-3 text-center">Costo compra ($)</th>
              <th className="px-4 py-3 text-center">Costo pedido ($)</th>
              <th className="px-4 py-3 text-center">Total ($)</th>
              <th className="px-4 py-3 text-center">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{o.id}</td>
                <td className="px-4 py-2 text-center">{o.fechaOrdenCompra}</td>
                <td className="px-4 py-2 text-center">
                  {o.proveedor.nombreProveedor}
                </td>
                <td className="px-4 py-2 text-center">
                  $
                  {o.costoCompraTotal != null
                    ? o.costoCompraTotal.toFixed(2)
                    : "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  $
                  {o.costoPedidoTotal != null
                    ? o.costoPedidoTotal.toFixed(2)
                    : "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  {o.costoTotal != null ? `$${o.costoTotal.toFixed(2)}` : "-"}
                </td>
                <td className="px-4 py-2 text-center">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold
                    ${
                      o.estado.codigoEstadoOrdenCompra === "PENDIENTE"
                        ? "bg-yellow-100 text-yellow-800"
                        : o.estado.codigoEstadoOrdenCompra === "CONFIRMADA"
                        ? "bg-blue-100 text-blue-800"
                        : o.estado.codigoEstadoOrdenCompra === "FINALIZADA"
                        ? "bg-green-100 text-green-800"
                        : o.estado.codigoEstadoOrdenCompra === "CANCELADA"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }`}
                  >
                    {o.estado.nombreEstadoOrdenCompra}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <OrdenCompraActions
                    onModificar={() => setOrdenSeleccionada(o.id)}
                    onVerDetalle={() => setVerDetalleId(o.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal modificar */}
      {ordenSeleccionada !== null && (
        <ModificarOrdenCompra
          ordenCompraId={ordenSeleccionada}
          cerrar={() => setOrdenSeleccionada(null)}
          alGuardar={() => {
            setOrdenSeleccionada(null);
            alGuardar();
          }}
        />
      )}

      {/* Modal detalle */}
      {verDetalleId !== null && (
        <DetalleOrdenCompraModal
          ordenId={verDetalleId}
          cerrar={() => setVerDetalleId(null)}
        />
      )}
    </div>
  );
}
