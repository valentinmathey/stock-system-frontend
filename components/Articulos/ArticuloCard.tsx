"use client";

import { useState } from "react";
import ModificarArticulo from "./ModificarArticulo";

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
  const [modalAbierto, setModalAbierto] = useState(false);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState<Articulo | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto rounded shadow bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3 text-center">Código</th>
              <th className="px-4 py-3 text-center">Nombre</th>
              <th className="px-4 py-3 text-center">Descripción</th>
              <th className="px-4 py-3 text-center">Stock actual</th>
              <th className="px-4 py-3 text-center">Stock seguridad</th>
              <th className="px-4 py-3 text-center">Costo Almacenamiento</th>
              <th className="px-4 py-3 text-center">Costo unidad ($)</th>
              <th className="px-4 py-3 text-center">CGI</th>
              <th className="px-4 py-3 text-center">Lote Óptimo</th>
              <th className="px-4 py-3 text-center">Punto Pedido</th>
              <th className="px-4 py-3 text-center">Inventario Máximo</th>
              <th className="px-4 py-3 text-center">Demanda Anual</th>
              <th className="px-4 py-3 text-center">Proveedor</th>
              <th className="px-4 py-2 text-center">Acciones</th>
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
                <td className="text-center">
                  <button
                    onClick={() => {
                      setArticuloSeleccionado(a);
                      setModalAbierto(true);
                    }}
                    className="bg-violet-600 px-4 py-2 rounded-xs font-medium text-white"
                  >
                    Modificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAbierto && articuloSeleccionado && (
        <ModificarArticulo
          articulo={articuloSeleccionado}
          cerrar={() => setModalAbierto(false)}
          alGuardar={() => {
            console.log("Guardando articulo");
            setModalAbierto(false);
          }}
        />
      )}
    </>
  );
}
