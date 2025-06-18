"use client";

import { useState, useCallback } from "react";
import { MoreVertical, Plus, List, ListIcon, X, PenSquare } from "lucide-react";

type Props = {
  onAsignar: () => void;
  onVerLista: () => void;
  onEditar: () => void;
};

export default function ArticuloActions({ onAsignar, onVerLista, onEditar }: Props) {
  const [open, setOpen] = useState(false);

  /* Cierra si se hace clic fuera de la tarjeta */
  const handleBackdrop = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) setOpen(false);
  }, []);

  return (
    <>
      {/* Botón disparador */}
      <button
        onClick={() => setOpen(true)}
        className="bg-violet-600 text-white px-3 py-1.5 rounded font-medium
                   inline-flex items-center gap-1"
      >
        Acciones
        <MoreVertical size={14} className="shrink-0" />
      </button>

      {/* Overlay + popup */}
      {open && (
        <div
          onClick={handleBackdrop}
          className="fixed inset-0 z-40 flex items-center justify-center
                     bg-black/60 "
        >
          <div className="bg-white rounded-lg shadow-xl w-64 p-4">
            {/* Cabecera */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Acciones</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Opciones */}
            <button
              onClick={() => {
                setOpen(false);
                onAsignar();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 rounded
                         hover:bg-gray-100 text-sm"
            >
              <Plus size={16} /> Asignar proveedor
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onVerLista();
              }}
              className="mt-1 flex w-full items-center gap-2 px-3 py-2 rounded
                         hover:bg-gray-100 text-sm"
            >
              <ListIcon size={16} /> Ver lista de proveedores
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onEditar();
              }}
              className="mt-1 flex w-full items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm"
            >
              <PenSquare size={16} /> Editar artículo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
