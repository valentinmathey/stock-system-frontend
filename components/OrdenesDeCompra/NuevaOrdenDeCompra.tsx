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

type Proveedor = {
  id: number;
  nombreProveedor: string;
};

export function NuevaOrdenCompra({ cerrar, alGuardar }: Props) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [proveedoresArticulo, setProveedoresArticulo] = useState<Proveedor[]>([]);
  const [formulario, setFormulario] = useState({
    fechaOrdenCompra: new Date().toISOString().split("T")[0],
    articuloId: 0,
    proveedorId: 0,
    detalles: [{ articuloId: 0, cantidadArticulo: 1 }],
  });

  useEffect(() => {
    fetch("http://localhost:3000/articulos")
      .then((res) => res.json())
      .then(setArticulos)
      .catch(() => setArticulos([]));
  }, []);

useEffect(() => {
  if (formulario.articuloId) {
    fetch(`http://localhost:3000/articulos/${formulario.articuloId}/proveedores?id=${formulario.articuloId}`)
      .then((res) => res.json())
      .then((data) => {
        // aseguramos que sea un array antes de setear
        if (Array.isArray(data)) {
          setProveedoresArticulo(data);
        } else {
          setProveedoresArticulo([]);
        }
      })
      .catch(() => setProveedoresArticulo([]));
  }
}, [formulario.articuloId]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: name === "fechaOrdenCompra" ? value : Number(value),
      detalles: name === "articuloId" ? [{ articuloId: Number(value), cantidadArticulo: 1 }] : prev.detalles,
    }));
  };

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
      detalles: [...prev.detalles, { articuloId: formulario.articuloId, cantidadArticulo: 1 }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validación previa
  if (
    formulario.proveedorId === 0 ||
    formulario.detalles.length === 0 ||
    formulario.detalles.some(
      (d) => d.articuloId === 0 || d.cantidadArticulo <= 0
    )
  ) {
    alert("Completá todos los campos antes de guardar.");
    return;
  }

  const payload = {
    fechaOrdenCompra: formulario.fechaOrdenCompra,
    proveedorId: formulario.proveedorId,
    detalles: formulario.detalles,
  };


  const res = await fetch("http://localhost:3000/ordenes-compra", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

          <label className="font-medium">Artículo</label>
          <select
            name="articuloId"
            value={formulario.articuloId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value={0}>Seleccionar artículo</option>
            {articulos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombreArticulo}
              </option>
            ))}
          </select>

          <label className="font-medium">Proveedor</label>
          <select
            name="proveedorId"
            value={formulario.proveedorId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value={0}>Seleccionar proveedor</option>
            {proveedoresArticulo.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombreProveedor}
              </option>
            ))}
          </select>

          <h3 className="text-lg font-semibold mt-4">Artículos</h3>
          {formulario.detalles.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4">
              <div>
                <label>Artículo</label>
                <input
                  disabled
                  value={formulario.articuloId}
                  className="w-full border border-gray-200 bg-gray-100 rounded px-3 py-2"
                />
              </div>
              <div>
                <label>Cantidad</label>
                <input
                  type="number"
                  value={item.cantidadArticulo}
                  onChange={(e) =>
                    handleDetalleChange(idx, "cantidadArticulo", e.target.value)
                  }
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
