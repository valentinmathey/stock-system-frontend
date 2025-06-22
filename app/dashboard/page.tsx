"use client";

import { DashboardContenido } from "@/components/Dashboard/DashboardContenido";
import { PageContainer } from "@/components/Varios/PageContainer";
import { useState } from "react";

export default function DashboardPage() {
  const [busqueda, setBusqueda] = useState("");

  return (
    <PageContainer
      valorBusqueda=""
      onBuscar={() => {}}
      showSearch={false} // aquí desactivas la barra de búsqueda
    >
      <DashboardContenido />
    </PageContainer>
  );
}
