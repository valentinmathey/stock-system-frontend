"use client";

import { useState } from "react";

type Props = {
  cerrar: () => void;
  alGuardar: () => void;
};

export function NuevaOrdenCompra({ cerrar, alGuardar }: Props) {
  const [formulario, setFormulario] = useState({
    fechaOrdenCompra: new Date().toISOString().split("T")[0],
    proveedorId: 1,
    detalles: [{ articuloId: 1, cantidadArticulo: 1 }],
  });

  const handleDetalleChange = (index: number, field: string, value: string) => {
    const nuevosDetalles = [...formulario.detalles];
    nuevosDetalles[index] = {
      ...nuevosDetalles[index],
      [field]: Number(value),
    };
    setFormulario((prev) => ({ ...prev, detalles: nuevosDetalles }));
  };

  const agregarArticulo = () => {
    setFormulario((prev) => ({
      ...prev,
      detalles: [...prev.detalles, { articuloId: 0, cantidadArticulo: 1 }],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: name === "fechaOrdenCompra" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/ordenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario),
    });

    if (res.ok) {
      alGuardar();
      cerrar();
    } else {
      alert("Error al registrar la orden de compra");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Nueva orden de compra</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="font-medium">Fecha</label>
          <input
            type="date"
            name="fechaOrdenCompra"
            value={formulario.fechaOrdenCompra}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <label className="font-medium">ID proveedor</label>
          <input
            type="number"
            name="proveedorId"
            value={formulario.proveedorId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <h3 className="text-lg font-semibold mt-4">Artículos</h3>
          {formulario.detalles.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4">
              <div>
                <label>ID Artículo</label>
                <input
                  type="number"
                  value={item.articuloId}
                  onChange={(e) => handleDetalleChange(idx, "articuloId", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label>Cantidad</label>
                <input
                  type="number"
                  value={item.cantidadArticulo}
                  onChange={(e) => handleDetalleChange(idx, "cantidadArticulo", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={agregarArticulo}
            className="text-blue-600 hover:underline text-sm"
          >
            + Agregar otro artículo
          </button>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="text-gray-600 hover:underline"
              onClick={cerrar}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
            >
              Guardar orden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
