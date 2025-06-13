"use client";

import { useEffect, useState } from "react";

type Articulo = {
  id: number;
  nombreArticulo: string;
};

type Props = {
  proveedorId: number;
  cerrar: () => void;
  alGuardar: () => void;
};

export default function ModificarProveedor({
  proveedorId,
  cerrar,
  alGuardar,
}: Props) {
  const [formulario, setFormulario] = useState({
    nombreProveedor: "",
    articulo: {
      articuloId: 0,
      modeloInventario: "LOTE_FIJO",
      costoPedido: 0,
      costoCompraUnitarioArticulo: 0,
      demoraEntregaProveedor: 0,
      tiempoRevision: undefined as number | undefined,
    },
  });

  const [articulos, setArticulos] = useState<Articulo[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/proveedores/${proveedorId}`)
      .then((res) => res.json())
      .then((data) => {
        setFormulario({
          nombreProveedor: data.nombreProveedor,
          articulo: {
            articuloId: data.articulos?.[0]?.id || 0,
            modeloInventario: "LOTE_FIJO",
            costoPedido: 0,
            costoCompraUnitarioArticulo: 0,
            demoraEntregaProveedor: 0,
            tiempoRevision: undefined,
          },
        });
      });

    fetch("http://localhost:3000/articulos")
      .then((res) => res.json())
      .then(setArticulos)
      .catch(() => setArticulos([]));
  }, [proveedorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name in formulario.articulo) {
      setFormulario((prev) => ({
        ...prev,
        articulo: {
          ...prev.articulo,
          [name]: name === "modeloInventario" ? value : Number(value),
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

    const res = await fetch(
      `http://localhost:3000/proveedores/${proveedorId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      }
    );

    if (res.ok) {
      alGuardar();
      cerrar();
    } else {
      alert("Error al modificar proveedor");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-8 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Modificar proveedor
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          <label className="font-medium">Nombre</label>
          <input
            type="text"
            name="nombreProveedor"
            value={formulario.nombreProveedor}
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
            {articulos.map((a) => (
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
            name="tiempoRevision"
            value={formulario.articulo.tiempoRevision ?? ""}
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
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
