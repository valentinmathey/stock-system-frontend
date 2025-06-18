"use client";

import { useState } from "react";
import { MoreVertical, Plus, List as ListIcon, X } from "lucide-react";

type Props = {
  onAgregarArticulo: () => void;
  onVerLista: () => void;
};

export default function ProviderActions({
  onAgregarArticulo,
  onVerLista,
}: Props) {
  const [open, setOpen] = useState(false);

  /* backdrop click = cerrar */
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-violet-600 text-white px-3 py-1.5 rounded
                   inline-flex items-center gap-1"
      >
        Acciones
        <MoreVertical size={14} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center"
          onClick={handleBackdrop}
        >
          <div className="bg-white rounded-lg shadow-xl w-64 p-4">
            {/* header */}
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Acciones</span>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                onAgregarArticulo();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 rounded
                         hover:bg-gray-100 text-sm"
            >
              <Plus size={16} /> Agregar artículo
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onVerLista();
              }}
              className="mt-1 flex w-full items-center gap-2 px-3 py-2 rounded
                         hover:bg-gray-100 text-sm"
            >
              <ListIcon size={16} /> Ver lista de articulos
            </button>
          </div>
        </div>
      )}
    </>
  );
}
