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
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Nuevo artículo</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-x-6 gap-y-4"
        >
          <GesProInputText
            name="codigoArticulo"
            handleChange={handleChange}
            label="Código"
          />

          <GesProInputText
            name="nombreArticulo"
            label="Nombre"
            handleChange={handleChange}
            required
          />

          <GesProInputText
            name="descripcionArticulo"
            handleChange={handleChange}
            required={false}
            label="Descripción"
          />

          <GesProInputNumber
            name="precioVentaUnitarioArticulo"
            handleChange={handleChange}
            label="Precio Venta ($)"
          />

          <GesProInputNumber
            name="costoAlmacenamientoPorUnidad"
            label="Costo almacenamiento ($)"
            handleChange={handleChange}
            required
          />

          <GesProInputNumber
            name="stockActual"
            handleChange={handleChange}
            label="Stock Actual"
          />

          <GesProInputNumber
            name="stockSeguridad"
            handleChange={handleChange}
            label="Stock Seguridad"
          />

          <GesProInputNumber
            name="loteOptimo"
            handleChange={handleChange}
            label="Lote óptimo"
            required={false}
          />
          <GesProInputNumber
            name="cgi"
            handleChange={handleChange}
            label="CGI"
            required={false}
          />

          <GesProInputNumber
            name="puntoPedido"
            handleChange={handleChange}
            label="Punto de pedido"
            required={false}
          />

          <GesProInputNumber
            name="inventarioMaximo"
            label="Inventario máximo"
            handleChange={handleChange}
          />

          <GesProInputNumber
            name="demandaAnual"
            label="Demanda anual"
            handleChange={handleChange}
          />
          <label className="font-medium">Proveedor</label>
          <select
            name="proveedorPredeterminadoId"
            value={formulario.proveedorPredeterminadoId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Seleccioná un proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombreProveedor}
              </option>
            ))}
          </select>

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
              Guardar artículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
