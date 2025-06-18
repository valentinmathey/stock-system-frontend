"use client";

import { useEffect, useState } from "react";

type Articulo = {
  nombreArticulo: string;
};

type Detalle = {
  cantidadArticulo: number;
  costoCompraUnitarioArticulo: number;
  costoCompraSubtotal: number;
  costoPedidoSubtotal: number;
  articulo: { nombreArticulo: string };
};

type Orden = {
  id: number;
  fechaOrdenCompra: string;
  proveedor: { nombreProveedor: string };
  costoPedidoTotal: number;
  costoCompraTotal: number;
  costoTotal: number;
  detallesOrden: Detalle[];
};

type Props = {
  ordenId: number;
  cerrar: () => void;
};

export default function DetalleOrdenCompraModal({ ordenId, cerrar }: Props) {
  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/ordenes-compra/${ordenId}`)
      .then((res) => res.json())
      .then(setOrden)
      .catch(() => alert("Error al cargar la orden"))
      .finally(() => setLoading(false));
  }, [ordenId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">Cargando...</div>
      </div>
    );
  }

  if (!orden) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-lg text-gray-800 font-semibold mb-2">
          Detalle de orden #{orden.id}
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          Fecha: {orden.fechaOrdenCompra}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Proveedor: {orden.proveedor.nombreProveedor}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Costo de pedido: ${orden.costoPedidoTotal.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Costo de compra: ${orden.costoCompraTotal.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Total: ${orden.costoTotal.toFixed(2)}
        </p>

        <table className="w-full text-sm text-left border border-gray-200 rounded overflow-hidden">
          <thead className="bg-gray-100 text-gray-600 font-semibold">
            <tr>
              <th className="px-3 py-2 text-center">Artículo</th>
              <th className="px-3 py-2 text-center">Cantidad</th>
              <th className="px-3 py-2 text-center">Precio unit.</th>
              <th className="px-3 py-2 text-center">Costo pedido</th>
              <th className="px-3 py-2 text-center">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orden.detallesOrden.map((d, i) => (
              <tr key={i} className="border-t text-gray-800 even:bg-gray-50">
                <td className="px-3 py-1 text-center">{d.articulo.nombreArticulo}</td>
                <td className="px-3 py-1 text-center">{d.cantidadArticulo}</td>
                <td className="px-3 py-1 text-center">
                  ${d.costoCompraUnitarioArticulo.toFixed(2)}
                </td>
                <td className="px-3 py-1 text-center">
                  ${d.costoPedidoSubtotal.toFixed(2)}
                </td>
                <td className="px-3 py-1 text-center">
                  ${d.costoCompraSubtotal.toFixed(2)}
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
