"use client";

import { useEffect, useState } from "react";
import { ArticuloTable } from "@/components/Articulos/ArticuloCard";
import { PageContainer } from "@/components/Varios/PageContainer";
import { NuevoArticulo } from "@/components/Articulos/NuevoArticulo";

/* ---------- Tipos ---------- */
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
  variacionDemanda: number;
  proveedorPredeterminado?: {
    id: number;
    nombreProveedor: string;
  };
};

/* ================================================================= */
export default function ArticulosPage() {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  /* --------- Trae y ordena --------- */
  const cargarArticulos = () => {
    fetch("http://localhost:3000/articulos")
      .then((res) => {
        if (!res.ok) throw new Error("Backend no disponible");
        return res.json();
      })
      .then((data: Articulo[]) => {
        /* Ordena por código (numérico) ASC       */
        /* Cambia a .localeCompare si tu código es texto puro */
        const ordenados = [...data].sort(
          (a, b) => Number(a.codigoArticulo) - Number(b.codigoArticulo)
        );
        setArticulos(ordenados);
      })
      .catch(console.error);
  };

  useEffect(cargarArticulos, []);

  /* --------- Filtro de búsqueda --------- */
  const articulosFiltrados = articulos.filter(
    (a) =>
      a.nombreArticulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.codigoArticulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  /* -------------------- UI -------------------- */
  return (
    <PageContainer valorBusqueda={busqueda} onBuscar={setBusqueda}>
      <div className="px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Artículos</h1>

          <button
            onClick={() => setModalAbierto(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
          >
            + Nuevo Artículo
          </button>
        </div>

        <ArticuloTable articulos={articulosFiltrados} onGuardar={cargarArticulos} />
      </div>

      {/* Modal de alta */}
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
