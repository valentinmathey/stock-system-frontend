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
  proveedorPredeterminado?: {
    id: number;
    nombreProveedor: string;
  };
};

const articulosDePrueba: Articulo[] = [
  {
    id: 1,
    codigoArticulo: "CEM001",
    nombreArticulo: "Cemento Portland",
    descripcionArticulo: "Bolsa de 50kg",
    stockActual: 26,
    stockSeguridad: 10,
    costoAlmacenamientoPorUnidad: 1.5,
    precioVentaUnitarioArticulo: 2.75,
    proveedorPredeterminado: {
      id: 1,
      nombreProveedor: "Holcim",
    },
  },
  {
    id: 2,
    codigoArticulo: "ARENA01",
    nombreArticulo: "Arena fina",
    descripcionArticulo: "Saco de 30kg",
    stockActual: 15,
    stockSeguridad: 5,
    costoAlmacenamientoPorUnidad: 0.8,
    precioVentaUnitarioArticulo: 1.9,
    proveedorPredeterminado: {
      id: 2,
      nombreProveedor: "Ferromax",
    },
  },
  {
    id: 3,
    codigoArticulo: "LADR001",
    nombreArticulo: "Ladrillo hueco",
    descripcionArticulo: "12x18x33cm",
    stockActual: 45,
    stockSeguridad: 20,
    costoAlmacenamientoPorUnidad: 0.5,
    precioVentaUnitarioArticulo: 1.25,
    proveedorPredeterminado: {
      id: 3,
      nombreProveedor: "Ladrillera Sur",
    },
  },
  {
    id: 4,
    codigoArticulo: "HIERRO10",
    nombreArticulo: "Hierro 10mm",
    descripcionArticulo: "Barra de 12m",
    stockActual: 8,
    stockSeguridad: 10,
    costoAlmacenamientoPorUnidad: 2.2,
    precioVentaUnitarioArticulo: 5.75,
    proveedorPredeterminado: {
      id: 4,
      nombreProveedor: "Acindar",
    },
  },
];

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
      .catch(() => setArticulos(articulosDePrueba));
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
