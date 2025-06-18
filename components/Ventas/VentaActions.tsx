"use client";

import { useState, useCallback } from "react";
import { MoreVertical, Eye, X } from "lucide-react";

type Props = {
  onVerDetalle: () => void;
};

export default function VentaActions({ onVerDetalle }: Props) {
  const [open, setOpen] = useState(false);

  const handleBackdrop = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) setOpen(false);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-violet-600 text-white px-3 py-1.5 rounded font-medium
                   inline-flex items-center gap-1"
      >
        Acciones
        <MoreVertical size={14} />
      </button>

      {open && (
        <div
          onClick={handleBackdrop}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
        >
          <div className="bg-white rounded-lg shadow-xl w-64 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Acciones</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                onVerDetalle();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 rounded
                         hover:bg-gray-100 text-sm"
            >
              <Eye size={16} /> Ver detalle
            </button>
          </div>
        </div>
      )}
    </>
  );
}
