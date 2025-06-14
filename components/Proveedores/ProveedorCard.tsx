"use client";

import { useState } from "react";
import ModificarProveedor from "./ModificarProveedor";

type Proveedor = {
  id: number;
  codigoProveedor: string;
  nombreProveedor: string;
};

type Props = {
  proveedores: Proveedor[];
};

export function ProveedorCard({ proveedores }: Props) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

  return (
    <>
      <div className="w-full overflow-x-auto rounded shadow bg-white">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Código</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{p.nombreProveedor}</td>
                <td className="px-4 py-2 font-medium">{p.codigoProveedor}</td>
                <td className="text-center">
                  <button
                    onClick={() => {
                      setProveedorSeleccionado(p);
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

      {modalAbierto && proveedorSeleccionado && (
        <ModificarProveedor
          proveedorId={proveedorSeleccionado.id}
          cerrar={() => setModalAbierto(false)}
          alGuardar={() => {
            console.log("Guardando proveedor");
            setModalAbierto(false);
          }}
        />
      )}
    </>
  );
}
