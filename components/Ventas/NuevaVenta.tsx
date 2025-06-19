"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  cerrar: () => void;
  alGuardar: () => void;
};

type Articulo = {
  id: number;
  nombreArticulo: string;
  precioVentaUnitarioArticulo: number;
};

export function NuevaVenta({ cerrar, alGuardar }: Props) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [formulario, setFormulario] = useState({
    fechaVenta: new Date().toISOString().split("T")[0],
    detalle: [{ articuloId: 0, cantidadArticulo: 1 }],
  });

  useEffect(() => {
    fetch("http://localhost:3000/articulos")
      .then((res) => res.json())
      .then(setArticulos)
      .catch(() => setArticulos([]));
  }, []);

  const handleDetalleChange = (index: number, field: string, value: string) => {
    const nuevoDetalle = [...formulario.detalle];
    nuevoDetalle[index] = {
      ...nuevoDetalle[index],
      [field]: Number(value),
    };
    setFormulario((prev) => ({ ...prev, detalle: nuevoDetalle }));
  };

  const agregarArticulo = () => {
    setFormulario((prev) => ({
      ...prev,
      detalle: [...prev.detalle, { articuloId: 0, cantidadArticulo: 1 }],
    }));
  };

  const calcularTotalVenta = () => {
    return formulario.detalle.reduce((total, item) => {
      const articulo = articulos.find((a) => a.id === item.articuloId);
      const precio = articulo?.precioVentaUnitarioArticulo ?? 0;
      return total + precio * item.cantidadArticulo;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones frontend
    if (!formulario.fechaVenta) {
      toast.warn("Seleccioná una fecha de venta");
      return;
    }

    if (formulario.detalle.length === 0) {
      toast.warn("Agregá al menos un artículo");
      return;
    }

    const articuloNoSeleccionado = formulario.detalle.some(
      (item) => item.articuloId === 0
    );

    if (articuloNoSeleccionado) {
      toast.warn("Hay artículos no seleccionados");
      return;
    }

    const cantidadInvalida = formulario.detalle.some(
      (item) => isNaN(item.cantidadArticulo) || item.cantidadArticulo <= 0
    );

    if (cantidadInvalida) {
      toast.warn("Las cantidades deben ser mayores a 0");
      return;
    }

    // Enviar al backend
    const ventaFinal = {
      ...formulario,
      ventaTotal: calcularTotalVenta(),
    };

    try {
      const res = await fetch("http://localhost:3000/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ventaFinal),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Venta registrada correctamente");
        alGuardar();
        cerrar();
      } else {
        // Errores personalizados desde NestJS
        const msg = data.message ?? "Error desconocido";

        if (msg.includes("repetidos")) {
          toast.error("Hay artículos repetidos en el detalle");
        } else if (msg.includes("Stock insuficiente")) {
          toast.error(`${msg}`);
        } else if (msg.includes("dado de baja")) {
          toast.error(`${msg}`);
        } else if (msg.includes("no existe")) {
          toast.error(`${msg}`);
        } else if (msg.includes("lote óptimo")) {
          toast.error(`${msg}`);
        } else {
          toast.error(`${msg}`);
        }
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-8 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Registrar venta</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="font-medium">Fecha de venta</label>
          <input
            type="date"
            name="fechaVenta"
            value={formulario.fechaVenta}
            onChange={(e) =>
              setFormulario({ ...formulario, fechaVenta: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          <h3 className="text-lg font-semibold mt-4">Artículos</h3>
          {formulario.detalle.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4">
              <div>
                <label>Artículo ID</label>
                <select
                  value={item.articuloId}
                  onChange={(e) =>
                    handleDetalleChange(idx, "articuloId", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  {articulos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombreArticulo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Cantidad</label>
                <input
                  type="number"
                  min={0}
                  value={item.cantidadArticulo}
                  onChange={(e) =>
                    handleDetalleChange(idx, "cantidadArticulo", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={agregarArticulo}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            + Agregar otro artículo
          </button>

          <div className="text-right font-bold mt-4">
            Total: ${calcularTotalVenta().toFixed(2)}
          </div>

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
              Guardar venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
