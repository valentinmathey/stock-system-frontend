"use client";

type OrdenCompra = {
  id: number;
  fechaOrden: string;
  proveedor: { nombreProveedor: string };
  total: number;
};

type Props = {
  ordenes: OrdenCompra[];
};

export function OrdenDeCompraCard({ ordenes }: Props) {
  return (
    <div className="w-full overflow-x-auto rounded shadow bg-white">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-left">Proveedor</th>
            <th className="px-4 py-3 text-right">Total ($)</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{o.id}</td>
              <td className="px-4 py-2">{o.fechaOrden}</td>
              <td className="px-4 py-2">{o.proveedor.nombreProveedor}</td>
              <td className="px-4 py-2 text-right">${o.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
