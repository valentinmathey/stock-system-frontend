"use client";
import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import { GesProInputNumber, GesProInputText } from "../GesproInputs";

type Props = {
  cerrar: () => void;
  alGuardar: () => void;
};

type Proveedor = {
  id: number;
  nombreProveedor: string;
};

export function NuevoArticulo({ cerrar, alGuardar }: Props) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [formulario, setFormulario] = useState({
    codigoArticulo: "",
    nombreArticulo: "",
    descripcionArticulo: "",
    precioVentaUnitarioArticulo: 0,
    costoAlmacenamientoPorUnidad: 0,
    stockActual: 0,
    stockSeguridad: 0,
    cgi: 0,
    loteOptimo: 0,
    puntoPedido: 0,
    inventarioMaximo: 0,
    demandaAnual: 0,
    proveedorPredeterminadoId: undefined,
  });

  useEffect(() => {
    fetch("http://localhost:3000/proveedores")
      .then((res) => res.json())
      .then(setProveedores)
      .catch(() => setProveedores([])); // Fallback por si falla
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]:
        name === "codigoArticulo" ||
        name === "nombreArticulo" ||
        name === "descripcionArticulo"
          ? value
          : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("llegué");
    const res = await fetch("http://localhost:3000/articulos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formulario),
    });

    if (res.ok) {
      alGuardar();
      cerrar();
    } else {
      alert("Error al crear artículo");
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center
                 bg-black/60 text-black"
    >
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Nuevo artículo</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          <GesProInputText
            name="codigoArticulo"
            label="Código"
            handleChange={handleChange}
          />
          <GesProInputText
            name="nombreArticulo"
            label="Nombre"
            handleChange={handleChange}
            required
          />
          <GesProInputText
            name="descripcionArticulo"
            label="Descripción"
            handleChange={handleChange}
            required={false}
          />

          <GesProInputNumber
            name="precioVentaUnitarioArticulo"
            label="Precio Venta ($)"
            handleChange={handleChange}
          />
          <GesProInputNumber
            name="costoAlmacenamientoPorUnidad"
            label="Costo almacenamiento ($)"
            handleChange={handleChange}
            required
          />
          <GesProInputNumber
            name="stockActual"
            label="Stock Actual"
            handleChange={handleChange}
          />
          <GesProInputNumber
            name="stockSeguridad"
            label="Stock Seguridad"
            handleChange={handleChange}
          />
          <GesProInputNumber
            name="demandaAnual"
            label="Demanda anual"
            handleChange={handleChange}
          />

          {/* Selector de proveedor */}
          <label className="font-medium">Proveedor</label>
          <select
            name="proveedorPredeterminadoId"
            value={formulario.proveedorPredeterminadoId}
            onChange={handleChange}
            className="col-span-2 border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccioná un proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombreProveedor}
              </option>
            ))}
          </select>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={cerrar}
              className="text-gray-600 hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
            >
              Guardar artículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
