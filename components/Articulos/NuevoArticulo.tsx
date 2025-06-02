'use client';

import { useState } from 'react';

type Props = {
  cerrar: () => void;
  alGuardar: () => void;
};

export function NuevoArticulo({ cerrar, alGuardar }: Props) {
  const [formulario, setFormulario] = useState({
    codigoArticulo: '',
    nombreArticulo: '',
    descripcionArticulo: '',
    precioVentaUnitarioArticulo: 0,
    costoAlmacenamientoPorUnidad: 0,
    stockActual: 0,
    stockSeguridad: 0,
    loteOptimo: 0,
    puntoPedido: 0,
    inventarioMaximo: 0,
    demandaAnual: 0,
    proveedorPredeterminadoId: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: name.includes('Articulo') ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/articulos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario),
    });

    if (res.ok) {
      alGuardar();
      cerrar();
    } else {
      alert('Error al crear artículo');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center text-black">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-8 z-50 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Nuevo artículo</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
          <label className="font-medium">Código</label>
          <input type="text" name="codigoArticulo" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Nombre</label>
          <input type="text" name="nombreArticulo" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Descripción</label>
          <input type="text" name="descripcionArticulo" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Precio venta ($)</label>
          <input type="number" name="precioVentaUnitarioArticulo" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Costo almacenamiento ($)</label>
          <input type="number" name="costoAlmacenamientoPorUnidad" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Stock actual</label>
          <input type="number" name="stockActual" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Stock seguridad</label>
          <input type="number" name="stockSeguridad" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Lote óptimo</label>
          <input type="number" name="loteOptimo" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Punto de pedido</label>
          <input type="number" name="puntoPedido" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Inventario máximo</label>
          <input type="number" name="inventarioMaximo" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">Demanda anual</label>
          <input type="number" name="demandaAnual" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

          <label className="font-medium">ID proveedor predeterminado</label>
          <input type="number" name="proveedorPredeterminadoId" onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />

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
