"use client";

import { useEffect, useState } from "react";
import { DashboardCard } from "./DashboardCard";
import { DashboardResumen } from "./DashboardResumen";

/* ---------- Modelos ---------- */
type Venta = {
  id: number;
  fechaVenta: string;
  ventaTotal: number;
};

type Orden = {
  id: number;
  fechaOrdenCompra: string;
  costoTotal: number;
  estado: { codigoEstadoOrdenCompra: string };
  detalles?: { cantidadArticulo: number }[];
};

type Articulo = {
  id: number;
  codigoArticulo: string;
  nombreArticulo: string;
  fechaAlta?: string | null;
  fechaBajaArticulo?: string | null;
  stockActual: number;
  stockSeguridad: number;
  puntoPedido: number;
  proveedorPredeterminado?: { nombreProveedor: string };
};

type Proveedor = {
  id: number;
  codigoProveedor: string;
  nombreProveedor: string;
  fechaBajaProveedor?: string;
};

/* ================================================================= */
export function DashboardContenido() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [ordenesPendientes, setOrdenesPendientes] = useState<Orden[]>([]);
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [reponer, setReponer] = useState<Articulo[]>([]);
  const [faltantes, setFaltantes] = useState<Articulo[]>([]);
  const [topStock, setTopStock] = useState<Articulo[]>([]);
  const [articulosDadosDeBaja, setArticulosDadosDeBaja] = useState<Articulo[]>(
    []
  );
  const [proveedoresDadosDeBaja, setProveedoresDadosDeBaja] = useState<
    Proveedor[]
  >([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [
          ventasR,
          ordenesR,
          artsR,
          repoR,
          faltR,
          topStockR,
          artsBajaR,
          provBajaR,
        ] = await Promise.all([
          fetch("http://localhost:3000/ventas").then((r) => r.json()),
          fetch("http://localhost:3000/ordenes-compra").then((r) => r.json()),
          fetch("http://localhost:3000/articulos").then((r) => r.json()),
          fetch("http://localhost:3000/articulos/paraReponer").then((r) =>
            r.json()
          ),
          fetch("http://localhost:3000/articulos/stockBajo").then((r) =>
            r.json()
          ),
          fetch("http://localhost:3000/articulos/top-stock?limit=5").then((r) =>
            r.json()
          ),
          fetch("http://localhost:3000/articulos/baja").then((r) => r.json()),
          fetch("http://localhost:3000/proveedores/baja").then((r) => r.json()),
        ]);

        const v = Array.isArray(ventasR) ? ventasR : [];
        const o = Array.isArray(ordenesR) ? ordenesR : [];
        const op = o.filter(
          (oc) => oc.estado?.codigoEstadoOrdenCompra === "PENDIENTE"
        );
        const a = Array.isArray(artsR) ? artsR : [];
        const r = Array.isArray(repoR) ? repoR : [];
        const f = Array.isArray(faltR) ? faltR : [];
        const t = Array.isArray(topStockR) ? topStockR : [];
        const ab = Array.isArray(artsBajaR) ? artsBajaR : [];
        const pb = Array.isArray(provBajaR) ? provBajaR : [];

        v.sort(
          (x, y) =>
            new Date(y.fechaVenta).getTime() - new Date(x.fechaVenta).getTime()
        );
        o.sort(
          (x, y) =>
            new Date(y.fechaOrdenCompra).getTime() -
            new Date(x.fechaOrdenCompra).getTime()
        );
        a.sort(
          (x, y) =>
            new Date(y.fechaAlta ?? 0).getTime() -
            new Date(x.fechaAlta ?? 0).getTime()
        );
        r.sort((a, b) => a.stockActual - b.stockActual);
        f.sort((a, b) => a.stockActual - b.stockActual);

        setVentas(v);
        setOrdenes(o);
        setOrdenesPendientes(op);
        setArticulos(a);
        setReponer(r);
        setFaltantes(f);
        setTopStock(t);
        setArticulosDadosDeBaja(ab);
        setProveedoresDadosDeBaja(pb);
      } catch (e) {
        console.error("Dashboard | error al cargar:", e);
      }
    };

    cargar();
  }, []);

  /* ---- datos para la tira-resumen ---- */
  const ultimoTotal = ventas[0]?.ventaTotal ?? 0;
  const ultimaVentaUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(ultimoTotal);

  /* ============================================================= */
  return (
    <div className="mt-6 space-y-6">
      {/* ► Resumen superior */}
      <DashboardResumen
        totalArticulos={articulos.length}
        bajoPuntoPedido={reponer.length}
        enStockSeguridad={faltantes.length}
        ordenesPendientes={ordenesPendientes.length}
        ultimaVenta={ultimaVentaUSD}
      />

      {/* ► Tarjetas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* ─── Últimas ventas */}
        <DashboardCard titulo="Últimas ventas">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="py-2 px-2 text-center">Fecha</th>
                <th className="py-2 px-2 text-center">Total ($)</th>
              </tr>
            </thead>
            <tbody>
              {ventas.slice(0, 5).map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="py-1.5 px-2 text-center">
                    {v.fechaVenta.split("T")[0]}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {v.ventaTotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
              {ventas.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-2 text-center text-gray-500">
                    Sin ventas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DashboardCard>

        {/* ─── Últimas OC */}
        <DashboardCard titulo="Últimas órdenes de compra">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="py-2 px-2 text-center">Fecha</th>
                <th className="py-2 px-2 text-center">Total($)</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-1.5 px-2 text-center">
                    {o.fechaOrdenCompra.split("T")[0]}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    $ {o.costoTotal != null ? o.costoTotal.toFixed(2) : "-"}
                  </td>
                </tr>
              ))}
              {ordenes.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-2 text-center text-gray-500">
                    Sin órdenes registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DashboardCard>

        {/* ─── Últimos artículos */}
        <DashboardCard titulo="Últimos artículos cargados">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="py-2 px-2 text-center">Código</th>
                <th className="py-2 px-2 text-center">Fecha alta</th>
                <th className="py-2 px-2 text-center">Proveedor</th>
              </tr>
            </thead>
            <tbody>
              {articulos.slice(0, 5).map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-1.5 px-2 text-center">
                    {a.codigoArticulo}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {a.fechaAlta ? a.fechaAlta.split("T")[0] : "—"}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {a.proveedorPredeterminado?.nombreProveedor ?? "—"}
                  </td>
                </tr>
              ))}
              {articulos.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-center text-gray-500">
                    Sin artículos cargados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DashboardCard>

        {/* ─── Artículos a reponer */}
        <DashboardCard titulo="Artículos a reponer">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="py-2 px-2 text-center">Artículo</th>
                <th className="py-2 px-2 text-center">Actual</th>
                <th className="py-2 px-2 text-center">Punto pedido</th>
              </tr>
            </thead>
            <tbody>
              {reponer.slice(0, 5).map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-1.5 px-2 text-center">
                    {a.nombreArticulo}
                  </td>
                  <td className="py-1.5 px-2 text-center">{a.stockActual}</td>
                  <td className="py-1.5 px-2 text-center">{a.puntoPedido}</td>
                </tr>
              ))}
              {reponer.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-center text-gray-500">
                    ¡Sin artículos por reponer!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DashboardCard>

        {/* ─── Artículos en stock de seguridad */}
        <DashboardCard titulo="Artículos en stock de seguridad">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="py-2 px-2 text-center">Artículo</th>
                <th className="py-2 px-2 text-center">Actual</th>
                <th className="py-2 px-2 text-center">Seguridad</th>
              </tr>
            </thead>
            <tbody>
              {faltantes.slice(0, 5).map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-1.5 px-2 text-center">
                    {a.nombreArticulo}
                  </td>
                  <td className="py-1.5 px-2 text-center">{a.stockActual}</td>
                  <td className="py-1.5 px-2 text-center">
                    {a.stockSeguridad}
                  </td>
                </tr>
              ))}
              {faltantes.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-center text-gray-500">
                    Nada dentro del stock de seguridad
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DashboardCard>

        {/* ----- Artículos con mayor stock ----- */}
        <DashboardCard titulo="Artículos con mayor stock">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="py-2 px-2 text-center">Artículo</th>
                <th className="py-2 px-2 text-center">Stock</th>
                <th className="py-2 px-2 text-center">Proveedor</th>
              </tr>
            </thead>
            <tbody>
              {topStock.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-1.5 px-2 text-center">
                    {a.nombreArticulo}
                  </td>
                  <td className="py-1.5 px-2 text-center">{a.stockActual}</td>
                  <td className="py-1.5 px-2 text-center">
                    {a.proveedorPredeterminado?.nombreProveedor ?? "—"}
                  </td>
                </tr>
              ))}
              {topStock.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-2 text-center text-gray-500">
                    Sin datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DashboardCard>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ─── Artículos dados de baja */}
        <DashboardCard titulo="Artículos dados de baja">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="py-2 px-2 text-center">Código</th>
                <th className="py-2 px-2 text-center">Nombre</th>
                <th className="py-2 px-2 text-center">Fecha de baja</th>
              </tr>
            </thead>
            <tbody>
              {articulosDadosDeBaja.map((a) => (
                <tr key={a.id} className="border-b last:border-0">
                  <td className="py-1.5 px-2 text-center">
                    {a.codigoArticulo}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {a.nombreArticulo}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {a.fechaBajaArticulo?.split("T")[0] ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>

        {/* ─── Proveedores dados de baja */}
        <DashboardCard titulo="Proveedores dados de baja">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-600 uppercase bg-gray-50">
              <tr>
                <th className="py-2 px-2 text-center">Código</th>
                <th className="py-2 px-2 text-center">Nombre</th>
                <th className="py-2 px-2 text-center">Fecha de baja</th>
              </tr>
            </thead>
            <tbody>
              {proveedoresDadosDeBaja.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-1.5 px-2 text-center">
                    {p.codigoProveedor}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {p.nombreProveedor}
                  </td>
                  <td className="py-1.5 px-2 text-center">
                    {p.fechaBajaProveedor?.split("T")[0] ?? "—"}
                  </td>
                </tr>
              ))}
              {proveedoresDadosDeBaja.length === 0 && (
                <tr>
                  <td colSpan={2} className="py-2 text-center text-gray-500">
                    Sin proveedores dados de baja
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DashboardCard>
      </div>
    </div>
  );
}
