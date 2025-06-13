"use client";

type Articulo = {
  id: number;
  codigoArticulo: string;
  nombreArticulo: string;
  descripcionArticulo: string;
  stockActual: number;
  stockSeguridad: number;
  costoAlmacenamientoPorUnidad: number;
  precioVentaUnitarioArticulo: number;
  cgi?: number;
  loteOptimo?: number;
  puntoPedido?: number;
  inventarioMaximo: number;
  demandaAnual: number;
  proveedorPredeterminado?: {
    id: number;
    nombreProveedor: string;
  };
};

type Props = {
  articulos: Articulo[];
};

export function ArticuloTable({ articulos }: Props) {
  return (
    <div className="w-full overflow-x-auto rounded shadow bg-white">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Código</th>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">Descripción</th>
            <th className="px-4 py-3 text-center">Stock actual</th>
            <th className="px-4 py-3 text-center">Stock seguridad</th>
            <th className="px-4 py-3 text-center">Costo Almacenamiento</th>
            <th className="px-4 py-3 text-center">Costo unidad ($)</th>
            <th className="px-4 py-3 text-center">CGI</th>
            <th className="px-4 py-3 text-center">Lote Óptimo</th>
            <th className="px-4 py-3 text-center">Punto Pedido</th>
            <th className="px-4 py-3 text-center">Inventario Máximo</th>
            <th className="px-4 py-3 text-center">Demanda Anual</th>
            <th className="px-4 py-3 text-left">Proveedor</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((a) => (
            <tr key={a.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{a.codigoArticulo}</td>
              <td className="px-4 py-2 font-medium">{a.nombreArticulo}</td>
              <td className="px-4 py-2">{a.descripcionArticulo}</td>
              <td
                className={`px-4 py-2 text-center font-bold ${
                  a.stockActual <= a.stockSeguridad
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {a.stockActual}
              </td>
              <td className="px-4 py-2 text-center">{a.stockSeguridad}</td>
              <td className="px-4 py-2 text-center">
                ${a.costoAlmacenamientoPorUnidad.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                ${a.precioVentaUnitarioArticulo.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">{a.cgi?.toFixed(2)}</td>
              <td className="px-4 py-2 text-center">
                {a.loteOptimo?.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {a.puntoPedido?.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {a.inventarioMaximo.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-center">
                {a.demandaAnual.toFixed(2)}
              </td>
              <td className="px-4 py-2">
                {a.proveedorPredeterminado?.nombreProveedor || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
