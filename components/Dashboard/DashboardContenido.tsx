"use client";

import { useEffect, useState } from "react";
import { DashboardResumen } from "./DashboardResumen";
import { DashboardCard } from "./DashboardCard";


export function DashboardContenido() {
  const [ventas, setVentas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [ventasRes, ordenesRes, articulosRes] = await Promise.all([
          fetch("http://localhost:3000/ventas").then((r) => r.json()),
          fetch("http://localhost:3000/ordenes-compra").then((r) => r.json()),
          fetch("http://localhost:3000/articulos").then((r) => r.json()),
        ]);

        setVentas(
          ventasRes.sort(
            (a: any, b: any) =>
              new Date(b.fechaVenta).getTime() -
              new Date(a.fechaVenta).getTime()
          )
        );
        setOrdenes(
          ordenesRes.sort(
            (a: any, b: any) =>
              new Date(b.fechaOrdenCompra).getTime() -
              new Date(a.fechaOrdenCompra).getTime()
          )
        );
        setArticulos(
          articulosRes.sort(
            (a: any, b: any) =>
              new Date(b.fechaAlta).getTime() - new Date(a.fechaAlta).getTime()
          )
        );
      } catch (e) {
        console.error("Error al cargar datos:", e);
      }
    };

    fetchDatos();
  }, []);

  return (
    <div className="mt-6 space-y-6">
      <DashboardResumen />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard titulo="Últimas ventas">
          <table className="min-w-full text-sm">
            <tbody>
              {ventas.slice(0, 5).map((v: any, i) => (
                <tr key={i} className="border-b">
                  <td className="py-1 px-2">{v.fechaVenta?.split("T")[0]}</td>
                  <td className="py-1 px-2 text-right">${v.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>

        <DashboardCard titulo="Últimas órdenes de compra">
          <table className="min-w-full text-sm">
            <tbody>
              {ordenes.slice(0, 5).map((o: any, i) => (
                <tr key={i} className="border-b">
                  <td className="py-1 px-2">{o.fechaOrdenCompra?.split("T")[0]}</td>
                  <td className="py-1 px-2 text-right">${o.detalles?.reduce((sum: number, d: any) => sum + d.cantidadArticulo, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>

        <DashboardCard titulo="Últimos artículos cargados">
          <table className="min-w-full text-sm">
            <tbody>
              {articulos.slice(0, 5).map((a: any, i) => (
                <tr key={i} className="border-b">
                  <td className="py-1 px-2">{a.nombreArticulo}</td>
                  <td className="py-1 px-2">{a.fechaAlta?.split("T")[0]}</td>
                  <td className="py-1 px-2">{a.proveedor?.nombreProveedor || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>
      </div>
    </div>
  );
}