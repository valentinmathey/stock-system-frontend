"use client";

import { useState } from "react";
import { MoreVertical, Plus, List as ListIcon } from "lucide-react";

type Props = {
  onAsignar: () => void; // abrir modal de “Asignar proveedor”
  onVerLista: () => void; // abrir modal de “Ver lista”
};

export default function ArticuloActions({ onAsignar, onVerLista }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Botón disparador */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-violet-600 text-white px-3 py-1.5 rounded font-medium
             inline-flex items-center gap-1"
      >
        Acciones
        <MoreVertical size={14} className="shrink-0" />
      </button>

      {/* Menú flotante */}
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5">
          <button
            onClick={() => {
              setOpen(false);
              onAsignar();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
          >
            <Plus size={16} /> Asignar proveedor
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onVerLista();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
          >
            <ListIcon size={16} /> Ver lista
          </button>
        </div>
      )}
    </div>
  );
}
