"use client";

import { useEffect, useState } from "react";
import { ArticuloTable } from "@/components/Articulos/ArticuloCard";
import { PageContainer } from "@/components/Varios/PageContainer";
import { NuevoArticulo } from "@/components/Articulos/NuevoArticulo";

export type Articulo = {
  id: number;
  codigoArticulo: string;
  nombreArticulo: string;
  descripcionArticulo: string;
  stockActual: number;
  stockSeguridad: number;
  costoAlmacenamientoPorUnidad: number;
  precioVentaUnitarioArticulo: number;
  cgi: number;
  loteOptimo: number;
  puntoPedido: number;
  inventarioMaximo: number;
  demandaAnual: number;
  proveedorPredeterminado?: {
    id: number;
    nombreProveedor: string;
  };
};

export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const cargarArticulos = () => {
    fetch("http://localhost:3000/articulos")
      .then((res) => {
        if (!res.ok) throw new Error("Backend no disponible");
        return res.json();
      })
      .then((data) => setArticulos(data))
  };

  useEffect(() => {
    cargarArticulos();
  }, []);

  const articulosFiltrados = articulos.filter(
    (a) =>
      a.nombreArticulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.codigoArticulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <PageContainer valorBusqueda={busqueda} onBuscar={setBusqueda}>
      <div className="px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Artículos</h1>
          <button
            onClick={() => setModalAbierto(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
          >
            + Nuevo artículo
          </button>
        </div>

        <ArticuloTable articulos={articulosFiltrados} />
      </div>

      {modalAbierto && (
        <NuevoArticulo
          cerrar={() => setModalAbierto(false)}
          alGuardar={() => {
            setModalAbierto(false);
            cargarArticulos();
          }}
        />
      )}
    </PageContainer>
  );
}
