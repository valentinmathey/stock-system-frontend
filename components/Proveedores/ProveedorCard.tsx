"use client";

import { useState } from "react";
import ModificarProveedor from "./ModificarProveedor";
import ProviderActions from "./ProviderActions";    
import ListaArtProvCard from "./ListaArtProvCard";     

type Proveedor = {
  id: number;
  codigoProveedor: string;
  nombreProveedor: string;
};

type Props = { proveedores: Proveedor[] };

export function ProveedorCard({ proveedores }: Props) {
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalLista, setModalLista]   = useState(false);
  const [provSel, setProvSel] = useState<Proveedor | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto rounded shadow bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3 text-center">Nombre</th>
              <th className="px-4 py-3 text-center">Código</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-center">{p.nombreProveedor}</td>
                <td className="px-4 py-2 text-center">{p.codigoProveedor}</td>
                <td className="px-4 py-2 text-center">
                  <ProviderActions
                    onAgregarArticulo={() => {
                      setProvSel(p);
                      setModalAgregar(true);
                    }}
                    onVerLista={() => {
                      setProvSel(p);
                      setModalLista(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal agregar artículo */}
      {modalAgregar && provSel && (
        <ModificarProveedor
          proveedorId={provSel.id}
          cerrar={() => setModalAgregar(false)}
          alGuardar={() => {
            setModalAgregar(false);
            // refresh desde la página si lo necesitas
          }}
        />
      )}

      {/* Modal lista artículos */}
      {modalLista && provSel && (
        <ListaArtProvCard
          proveedorId={provSel.id}
          nombreProveedor={provSel.nombreProveedor}
          cerrar={() => setModalLista(false)}
        />
      )}
    </>
  );
}
