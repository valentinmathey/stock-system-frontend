"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/Varios/PageContainer";
import { ProveedorCard } from "@/components/Proveedores/ProveedorCard";
import { NuevoProveedor } from "@/components/Proveedores/NuevoProveedor";

type Proveedor = {
  id: number;
  codigoProveedor: string;
  nombreProveedor: string;
};

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const cargarProveedores = () => {
    fetch("http://localhost:3000/proveedores")
      .then((res) => {
        if (!res.ok) throw new Error("Backend no disponible");
        return res.json();
      })
      .then((data) => setProveedores(data));
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombreProveedor.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <PageContainer valorBusqueda={busqueda} onBuscar={setBusqueda}>
      <div className="px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-black">Proveedores</h1>
          <button
            onClick={() => setModalAbierto(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 transition"
          >
            + Nuevo proveedor
          </button>
        </div>

        <ProveedorCard proveedores={proveedoresFiltrados} />
      </div>

      {modalAbierto && (
        <NuevoProveedor
          cerrar={() => setModalAbierto(false)}
          alGuardar={() => {
            console.log("guardando proveedor...");
            setModalAbierto(false);
            cargarProveedores();
          }}
        />
      )}
    </PageContainer>
  );
}
