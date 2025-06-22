"use client";

import { useState } from "react";
import ModificarArticulo from "./ModificarArticulo";
import ArticuloActions from "./ArticuloActions";
import ListaProveedoresCard from "./ListaProveedoresCard";
import { EditarArticulo } from "./EditarArticulo";
import { EliminarArticulo } from "./EliminarArticulo";

/* ---------- Tipos ---------- */
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
  inventarioMaximo?: number;
  demandaAnual: number;
  variacionDemanda: number;
  proveedorPredeterminado?: { id: number; nombreProveedor: string };
};

type Props = {
  articulos: Articulo[];
  onGuardar: () => void;
};

/* --------------------------------------------------------------- */
export function ArticuloTable({ articulos, onGuardar }: Props) {
  const [modalPred, setModalPred] = useState(false);
  const [modalLista, setModalLista] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState<Articulo | null>(null);
  const [artSel, setArtSel] = useState<Articulo | null>(null);

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
              <th className="px-4 py-3 text-center">Precio Venta</th>
              <th className="px-4 py-3 text-center">CGI</th>
              <th className="px-4 py-3 text-center">Lote Óptimo</th>
              <th className="px-4 py-3 text-center">Punto Pedido</th>
              <th className="px-4 py-3 text-center">Inventario Máximo</th>
              <th className="px-4 py-3 text-center">Demanda Anual</th>
              <th className="px-4 py-3 text-center">Variación Demanda</th>
              <th className="px-4 py-3 text-center">Proveedor</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {articulos.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{a.codigoArticulo}</td>
                <td className="px-4 py-2 font-medium text-center">
                  {a.nombreArticulo}
                </td>
                <td className="px-4 py-2 text-center">
                  {a.descripcionArticulo}
                </td>
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
                  {a.inventarioMaximo?.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {a.demandaAnual.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {a.variacionDemanda?.toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  {a.proveedorPredeterminado?.nombreProveedor || "—"}
                </td>

                <td className="px-4 py-2 text-center text-black">
                  <ArticuloActions
                    onAsignar={() => {
                      setArtSel(a);
                      setModalPred(true);
                    }}
                    onVerLista={() => {
                      setArtSel(a);
                      setModalLista(true);
                    }}
                    onEditar={() => {
                      setArtSel(a);
                      setModalEditar(true);
                    }}
                    onEliminar={() => {
                      setArtSel(a);
                      setModalEliminar(a);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Asignar proveedor */}
      {modalPred && artSel && (
        <ModificarArticulo
          articulo={artSel}
          cerrar={() => setModalPred(false)}
          alGuardar={() => {
            setModalPred(false);
            onGuardar();
          }}
        />
      )}

      {/* Modal: Ver lista de proveedores */}
      {modalLista && artSel && (
        <ListaProveedoresCard
          articuloId={artSel.id}
          nombreArticulo={artSel.nombreArticulo}
          cerrar={() => setModalLista(false)}
        />
      )}

      {/* Modal: Editar artículo */}
      {modalEditar && artSel && (
        <EditarArticulo
          articulo={artSel}
          cerrar={() => setModalEditar(false)}
          alGuardar={() => {
            setModalEditar(false);
            onGuardar();
          }}
        />
      )}

      {/* Modal: Eliminar artículo */}
      {modalEliminar && (
        <EliminarArticulo
          articulo={modalEliminar}
          cerrar={() => setModalEliminar(null)}
          alGuardar={() => {
            setModalEliminar(null);
            onGuardar();
          }}
        />
      )}
    </>
  );
}
