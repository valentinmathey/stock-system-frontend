"use client";

type Venta = {
  id: number;
  fechaVenta: string;
  cliente: string;
  total: number;
};

type Props = {
  ventas: Venta[];
};

export function VentaCard({ ventas }: Props) {
  return (
    <div className="w-full overflow-x-auto rounded shadow bg-white">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Fecha</th>
            <th className="px-4 py-3 text-left">Cliente</th>
            <th className="px-4 py-3 text-right">Total ($)</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{v.fechaVenta}</td>
              <td className="px-4 py-2">{v.cliente}</td>
              <td className="px-4 py-2 text-right">${v.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
