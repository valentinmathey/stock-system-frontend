"use client";

import { useEffect, useState } from "react";

type Props = {
  cerrar: () => void;
  alGuardar: () => void;
};

type Articulo = {
  id: number;
  nombreArticulo: string;
};

export function NuevoProveedor({ cerrar, alGuardar }: Props) {
  const [articulosDisponibles, setArticulosDisponibles] = useState<Articulo[]>(
    []
  );

  const [formulario, setFormulario] = useState({
    codigoProveedor: "",
    nombreProveedor: "",
    articulo: {
      proveedorId: 0,
      articuloId: undefined,
      modeloInventario: "LOTE_FIJO",
      costoPedido: undefined,
      costoCompraUnitarioArticulo: undefined,
      demoraEntregaProveedor: undefined,
      tiempoRevision: undefined as number | undefined,
    },
  });

  useEffect(() => {
    fetch("http://localhost:3000/articulos")
      .then((res) => res.json())
      .then(setArticulosDisponibles)
      .catch(() => setArticulosDisponibles([]));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name in formulario.articulo) {
      setFormulario((prev) => ({
        ...prev,
        articulo: {
          ...prev.articulo,
          [name]: name === "articuloId" ? Number(value) : Number(value),
        },
      }));
    } else {
      setFormulario((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/proveedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario),
    });

    if (res.ok) {
      alGuardar();
      cerrar();
    } else {
      alert("Error al crear proveedor");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-8 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Nuevo proveedor</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          <label className="font-medium">Código</label>
          <input
            type="text"
            name="codigoProveedor"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Nombre</label>
          <input
            type="text"
            name="nombreProveedor"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Artículo</label>
          <select
            name="articuloId"
            value={formulario.articulo.articuloId}
            onChange={handleChange}
            required
            className="col-span-2 border border-gray-300 rounded px-3 py-2"
          >
            <option value={0}>Seleccionar artículo</option>
            {articulosDisponibles.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombreArticulo}
              </option>
            ))}
          </select>
          <label className="font-medium">Modelo de Inventario</label>
          <select
            name="modeloInventario"
            value={formulario.articulo.modeloInventario}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="LOTE_FIJO">Lote Fijo</option>
            <option value="TIEMPO_FIJO">Tiempo Fijo</option>
          </select>

          <label className="font-medium">Costo pedido</label>
          <input
            type="number"
            name="costoPedido"
            value={formulario.articulo.costoPedido}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Costo compra unitario</label>
          <input
            type="number"
            name="costoCompraUnitarioArticulo"
            value={formulario.articulo.costoCompraUnitarioArticulo}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Demora entrega (días)</label>
          <input
            type="number"
            name="demoraEntregaProveedor"
            value={formulario.articulo.demoraEntregaProveedor}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <label className="font-medium">Tiempo de Revisión</label>
          <input
            type="number"
            name="proximaFechaRevision"
            value={formulario.articulo.tiempoRevision}
            required
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <div className="col-span-2 flex justify-end gap-4 pt-4">
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
              Guardar proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
