// components/Dashboard/DashboardResumen.tsx
"use client";

import { useEffect, useState } from "react";
import { Box, TriangleAlert, FileClock, DollarSign, Flame } from "lucide-react";

export function DashboardResumen() {
  const [resumen, setResumen] = useState({
    totalArticulos: 0,
    bajoStock: 0,
    ordenesPendientes: 0,
    ultimaVenta: "$0",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articulos, bajoStock, ordenes, ventas] = await Promise.all([
          fetch("http://localhost:3000/articulos").then((r) => r.json()),
          fetch("http://localhost:3000/articulos/stockBajo").then((r) =>
            r.json()
          ),
          fetch("http://localhost:3000/ordenes-compra").then((r) => r.json()),
          fetch("http://localhost:3000/ventas").then((r) => r.json()),
        ]);

        const ultima = ventas.length
          ? `$${(
              ventas.sort(
                (a: any, b: any) =>
                  new Date(b.fechaVenta).getTime() -
                  new Date(a.fechaVenta).getTime()
              )[0] as any
            ).total.toLocaleString()}`
          : "$0";

        setResumen({
          totalArticulos: articulos.length,
          bajoStock: bajoStock.length,
          ordenesPendientes: ordenes.length,
          ultimaVenta: ultima,
        });
      } catch (e) {
        console.error("Error al cargar resumen:", e);
      }
    };

    fetchData();
  }, []);

  const tarjetas = [
    {
      icono: <Box className="text-black" />,
      label: "Total de artículos",
      valor: resumen.totalArticulos,
      texto: "text-black",
      fondo: "#A5F7E1",
    },
    {
      icono: <TriangleAlert className="text-black" />,
      label: "Bajo punto de pedido",
      valor: resumen.bajoStock,
      texto: "text-black",
      fondo: "#FEE5A5",
    },
    {
      icono: <Flame className="text-black" />,
      label: "En stock de seguridad",
      valor: resumen.bajoStock,
      texto: "text-black",
      fondo: "#F2A7A7",
    },
    {
      icono: <FileClock className="text-black" />,
      label: "OC pendientes",
      valor: resumen.ordenesPendientes,
      texto: "text-black",
      fondo: "#AAA7F2",
    },
    {
      icono: <DollarSign className="text-black" />,
      label: "Última venta",
      valor: resumen.ultimaVenta,
      texto: "text-black",
      fondo: "#B1F2A7",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {tarjetas.map((t, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 p-4 rounded-xl shadow ${t.texto}`}
          style={{ backgroundColor: t.fondo }}
        >
          <div className="bg-white rounded-full p-2 shadow-md">{t.icono}</div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide">
              {t.label}
            </p>
            <p className="text-xl font-bold">{t.valor}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
