"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Tipos
interface Props {
  cerrar: () => void;
  alGuardar: () => void;
}

interface ArticuloExtendido {
  id: number;
  nombreArticulo: string;
  stockActual: number;
  stockSeguridad: number;
  inventarioMaximo?: number;
  loteOptimo?: number;
  modeloInventario?: "LOTE_FIJO" | "TIEMPO_FIJO";
}

interface Proveedor {
  id: number;
  nombreProveedor: string;
}

export function NuevaOrdenCompra({ cerrar, alGuardar }: Props) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [articulosProveedor, setArticulosProveedor] = useState<
    ArticuloExtendido[]
  >([]);

  const [formulario, setFormulario] = useState({
    fechaOrdenCompra: new Date().toISOString().split("T")[0],
    proveedorId: 0,
    detalles: [] as { articuloId: number; cantidadArticulo: number }[],
  });

  // Cargar proveedores al inicio
  useEffect(() => {
    fetch("http://localhost:3000/proveedores")
      .then((res) => res.json())
      .then((data) => setProveedores(Array.isArray(data) ? data : []));
  }, []);

  // Cuando cambia proveedor
  useEffect(() => {
    if (!formulario.proveedorId) return;

    fetch(
      `http://localhost:3000/proveedores/${formulario.proveedorId}/articulos`
    )
      .then((res) => res.json())
      .then((data) => {
        setArticulosProveedor(Array.isArray(data) ? data : []);
        setFormulario((prev) => ({
          ...prev,
          detalles: [{ articuloId: 0, cantidadArticulo: 1 }],
        }));
      });
  }, [formulario.proveedorId]);

  const handleProveedorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormulario((prev) => ({
      ...prev,
      proveedorId: Number(e.target.value),
      detalles: [],
    }));
  };

  const handleAgregarArticulo = () => {
    setFormulario((prev) => ({
      ...prev,
      detalles: [...prev.detalles, { articuloId: 0, cantidadArticulo: 1 }],
    }));
  };

  const handleDetalleChange = (index: number, field: string, value: string) => {
    const nuevos = [...formulario.detalles];
    nuevos[index] = {
      ...nuevos[index],
      [field]: Number(value),
    };
    setFormulario((prev) => ({ ...prev, detalles: nuevos }));
  };

  const handleArticuloSelect = (index: number, articuloId: number) => {
    const existe = formulario.detalles.some(
      (d, i) => d.articuloId === articuloId && i !== index
    );
    if (existe) {
      toast.warn("Ese artículo ya está seleccionado");
      return;
    }

    const art = articulosProveedor.find((a) => a.id === articuloId);
    if (!art) return;

    fetch("http://localhost:3000/ordenes-compra")
      .then((res) => res.json())
      .then((ordenes) => {
        const yaExiste = ordenes.some(
          (oc: any) =>
            oc.proveedor.id === formulario.proveedorId &&
            oc.detallesOrden.some((d: any) => d.articulo.id === articuloId) &&
            ["PENDIENTE", "CONFIRMADA"].includes(
              oc.estado.codigoEstadoOrdenCompra
            )
        );
        if (yaExiste) {
          toast.warn("Este artículo ya tiene una OC activa con este proveedor");
          return;
        }

        const cantidadSugerida =
          art.modeloInventario === "LOTE_FIJO"
            ? art.loteOptimo ?? 1
            : (art.inventarioMaximo ?? 0) +
              art.stockSeguridad -
              art.stockActual;

        const nuevos = [...formulario.detalles];
        nuevos[index] = {
          articuloId,
          cantidadArticulo: Math.max(1, cantidadSugerida),
        };
        setFormulario((prev) => ({ ...prev, detalles: nuevos }));
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formulario.fechaOrdenCompra || !formulario.proveedorId) {
      toast.warn("Completá todos los campos obligatorios");
      return;
    }

    if (!formulario.detalles.length) {
      toast.warn("Agregá al menos un artículo");
      return;
    }

    for (const detalle of formulario.detalles) {
      if (!detalle.articuloId || detalle.cantidadArticulo <= 0) {
        toast.warn("Verificá los datos de cada artículo");
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:3000/ordenes-compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Orden registrada correctamente.");
        cerrar();
        alGuardar();
      } else {
        toast.error(data.message || "Error desconocido");
      }
    } catch (err) {
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 text-black">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Registrar orden de compra
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="font-medium">Fecha</label>
          <input
            type="date"
            value={formulario.fechaOrdenCompra}
            onChange={(e) =>
              setFormulario({ ...formulario, fechaOrdenCompra: e.target.value })
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />

          <label className="font-medium">Proveedor</label>
          <select
            value={formulario.proveedorId}
            onChange={handleProveedorChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value={0}>Seleccionar proveedor</option>
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombreProveedor}
              </option>
            ))}
          </select>

          {formulario.detalles.map((detalle, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-4">
              <div>
                <label>Artículo</label>
                <select
                  value={detalle.articuloId}
                  onChange={(e) =>
                    handleArticuloSelect(idx, Number(e.target.value))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value={0}>Seleccionar artículo</option>
                  {articulosProveedor.map((a) => (
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
                  min={1}
                  value={detalle.cantidadArticulo}
                  onChange={(e) =>
                    handleDetalleChange(idx, "cantidadArticulo", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
          ))}

          {!!formulario.proveedorId && (
            <button
              type="button"
              onClick={handleAgregarArticulo}
              className="text-blue-600 hover:underline text-sm"
            >
              + Agregar otro artículo
            </button>
          )}

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
