// app/ventas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/Varios/PageContainer";
import { VentaCard } from "@/components/Ventas/VentaCard";
import { NuevaVenta } from "@/components/Ventas/NuevaVenta";


type Venta = {
  id: number;
  fechaVenta: string;
  cliente: string;
  total: number;
};

const ventasDePrueba: Venta[] = [
  {
    id: 1,
    fechaVenta: "2024-06-01",
    cliente: "Juan Pérez",
    total: 2500,
  },
  {
    id: 2,
    fechaVenta: "2024-06-03",
    cliente: "Obras Mendoza SRL",
    total: 7200,
  },
];

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const cargarVentas = () => {
    fetch("http://localhost:3000/ventas")
      .then((res) => {
        if (!res.ok) throw new Error("Backend no disponible");
        return res.json();
      })
      .then((data) => setVentas(data))
      .catch(() => setVentas(ventasDePrueba));
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const ventasFiltradas = ventas.filter((v) =>
    v.cliente.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <PageContainer valorBusqueda={busqueda} onBuscar={setBusqueda}>
      <div className="px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Ventas</h1>
          <button
            onClick={() => setModalAbierto(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
          >
            + Registrar venta
          </button>
        </div>

        <VentaCard ventas={ventasFiltradas} />
      </div>

      {modalAbierto && (
        <NuevaVenta
          cerrar={() => setModalAbierto(false)}
          alGuardar={() => {
            setModalAbierto(false);
            cargarVentas();
          }}
        />
      )}
    </PageContainer>
  );
}
