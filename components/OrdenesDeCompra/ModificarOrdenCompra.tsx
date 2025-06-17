"use client";
import { useEffect, useState } from "react";

/* ----------- Tipos ----------- */
interface Estado {
  id: number;
  codigoEstadoOrdenCompra:
    | "PENDIENTE"
    | "CONFIRMADA"
    | "FINALIZADA"
    | "CANCELADA";
  nombreEstadoOrdenCompra: string;
}
interface Detalle {
  articuloId: number;
  nombreArticulo: string;
  cantidadArticulo: number;
}
interface Props {
  ordenCompraId: number;
  cerrar: () => void;
  alGuardar: () => void;
}

/* ----------- Endpoints ----------- */
const API = "http://localhost:3000";
const OC = `${API}/ordenes-compra`;
const EST = `${API}/estados-orden-compra`;

export function ModificarOrdenCompra({
  ordenCompraId,
  cerrar,
  alGuardar,
}: Props) {
  /* ----------- State ----------- */
  const [estados, setEstados] = useState<Estado[]>([]);
  const [estadoActual, setEA] = useState<Estado | null>(null);
  const [estadoId, setEstadoId] = useState<number | null>(null);
  const [detalles, setDetalles] = useState<Detalle[]>([]);
  const [loading, setLoading] = useState(true);

  const esPendiente = estadoActual?.codigoEstadoOrdenCompra === "PENDIENTE";
  const esConfirmada = estadoActual?.codigoEstadoOrdenCompra === "CONFIRMADA";

  /* ----------- Fetch inicial ----------- */
  useEffect(() => {
    (async () => {
      try {
        const oc = await fetch(`${OC}/${ordenCompraId}`).then((r) => r.json());
        setEA(oc.estado);
        setEstadoId(oc.estado.id);
        setDetalles(
          oc.detallesOrden.map((d: any) => ({
            articuloId: d.articulo.id,
            nombreArticulo: d.articulo.nombreArticulo,
            cantidadArticulo: d.cantidadArticulo,
          }))
        );
        /* catálogo de estados */
        const lista = await fetch(EST).then((r) => r.json());
        setEstados(lista);
      } finally {
        setLoading(false);
      }
    })();
  }, [ordenCompraId]);

  /* ----------- util fetch ----------- */
  const call = (url: string, method: string, body?: any) =>
    fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body && JSON.stringify(body),
    }).then(async (r) => {
      if (!r.ok) throw new Error(await r.text());
    });

  /* ----------- Acciones ----------- */
  const guardarEdicion = async () => {
    const payload = {
      estadoId,
      detalles: detalles.map((d) => ({
        articuloId: d.articuloId,
        cantidadArticulo: d.cantidadArticulo,
      })),
    };
    await call(`${OC}/${ordenCompraId}`, "PUT", payload);
    alGuardar();
    cerrar();
  };

  const confirmar = () =>
    call(`${OC}/${ordenCompraId}/confirmar`, "PATCH").then(() => {
      alGuardar();
      cerrar();
    });
  const finalizar = () =>
    call(`${OC}/${ordenCompraId}/finalizar`, "PATCH").then(() => {
      alGuardar();
      cerrar();
    });
  const cancelar = async () => {
    const estadoCancelada = estados.find(
      (e) => e.codigoEstadoOrdenCompra === "CANCELADA"
    );
    if (!estadoCancelada) {
      alert("No se encontró el estado CANCELADA");
      return;
    }

    await call(`${OC}/${ordenCompraId}`, "PUT", {
      estadoId: estadoCancelada.id,
    })
      .then(() => {
        alGuardar();
        cerrar();
      })
      .catch((err) => alert("Error al cancelar:\n" + err.message));
  };

  /* ----------- Render ----------- */
  if (loading || !estadoActual) return null;

  /* opciones válidas de cambio de estado (solo PENDIENTE→CONFIRMADA) */
  const estadosOpcionales = esPendiente
    ? estados.filter((e) => e.codigoEstadoOrdenCompra === "CONFIRMADA")
    : [];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-black">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Modificar Orden #{ordenCompraId}
        </h2>

        {/* ---------- Estado ---------- */}
        <div className="mb-4">
          <span className="font-medium mr-2">Estado actual:</span>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold
      ${
        estadoActual.codigoEstadoOrdenCompra === "PENDIENTE" &&
        "bg-yellow-100 text-yellow-800"
      }
      ${
        estadoActual.codigoEstadoOrdenCompra === "CONFIRMADA" &&
        "bg-blue-100   text-blue-800"
      }
      ${
        estadoActual.codigoEstadoOrdenCompra === "FINALIZADA" &&
        "bg-green-100  text-green-800"
      }
      ${
        estadoActual.codigoEstadoOrdenCompra === "CANCELADA" &&
        "bg-red-100    text-red-800"
      }
    `}
          >
            {estadoActual.nombreEstadoOrdenCompra}
          </span>
        </div>
        {/* (el <select> se elimina completamente) */}

        {/* ---------- Detalles ---------- */}
        <h3 className="text-lg font-semibold mb-2">Detalles</h3>
        {detalles.map((d, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 mb-2">
            <input
              disabled
              value={d.nombreArticulo}
              className="border rounded bg-gray-100 px-3 py-2"
            />
            <input
              type="number"
              disabled={!esPendiente}
              value={d.cantidadArticulo}
              onChange={(e) => {
                const val = Number(e.target.value);
                setDetalles((prev) =>
                  prev.map((x, idx) =>
                    idx === i ? { ...x, cantidadArticulo: val } : x
                  )
                );
              }}
              className="border rounded px-3 py-2"
            />
          </div>
        ))}

        {/* ---------- Botones ---------- */}
        <div className="flex justify-between mt-6">
          {esPendiente && (
            <>
              {/* Cancelar */}
              <button
                onClick={cancelar}
                className="text-red-600 hover:underline"
              >
                Cancelar orden
              </button>

              <button
                onClick={confirmar}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
              >
                Confirmar orden
              </button>
              <button
                onClick={guardarEdicion}
                className="bg-violet-600 text-white px-3 py-2 rounded hover:bg-violet-700"
              >
                Guardar cambios
              </button>
            </>
          )}

          {esConfirmada && (
            <button
              onClick={finalizar}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mx-auto"
            >
              Finalizar orden
            </button>
          )}
        </div>

        <div className="text-right mt-4">
          <button
            onClick={cerrar}
            className="text-gray-600 hover:underline text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
