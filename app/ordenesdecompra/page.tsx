"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/Varios/PageContainer";
import { NuevaOrdenCompra } from "@/components/OrdenesDeCompra/NuevaOrdenDeCompra";
import { OrdenDeCompraCard } from "@/components/OrdenesDeCompra/OrdenDeCompraCard";

type EstadoOrdenCompra = {
  id: number;
  codigoEstadoOrdenCompra: string;
  nombreEstadoOrdenCompra: string;
  fechaBajaEstadoOrdenCompra: string | null;
};

type OrdenCompra = {
  id: number;
  fechaOrdenCompra: string;
  proveedor: { nombreProveedor: string };
  costoPedidoTotal: number;
  costoCompraTotal: number;
  costoTotal: number;
  estado: EstadoOrdenCompra;
};


export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const cargarOrdenes = () => {
    fetch("http://localhost:3000/ordenes-compra")
      .then((res) => {
        if (!res.ok) throw new Error("Backend no disponible");
        return res.json();
      })
      .then((data) => setOrdenes(data))
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const ordenesFiltradas = ordenes.filter((o) =>
    o.proveedor.nombreProveedor.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <PageContainer valorBusqueda={busqueda} onBuscar={setBusqueda}>
      <div className="px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Órdenes de compra</h1>
          <button
            onClick={() => setModalAbierto(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
          >
            + Nueva Orden
          </button>
        </div>

        <OrdenDeCompraCard
          ordenes={ordenesFiltradas}
          alGuardar={cargarOrdenes}
        />
      </div>

      {modalAbierto && (
        <NuevaOrdenCompra
          cerrar={() => setModalAbierto(false)}
          alGuardar={() => {
            cargarOrdenes(); // esta sí está definida acá
            setModalAbierto(false);
          }}
        />
      )}
    </PageContainer>
  );
}
