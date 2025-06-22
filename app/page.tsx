"use client";

import { useEffect, useState } from "react";
import { BotonInicio } from "@/components/Inicio/BotonInicio";
import {
  ArrowRightLeft,
  FileText,
  Handshake,
  LayoutDashboard,
  Package,
  UserRound,
} from "lucide-react";

const frasesFoco = [
  "¡Hola! Soy tu asistente de stock.",
  "¿Cargaste los artículos con proveedor?",
  "Revisá el punto de pedido en artículos.",
];

export default function Home() {
  const [mensajeIndex, setMensajeIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setMensajeIndex((prev) => (prev + 1) % frasesFoco.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#6805F2] to-[#D001FF] flex flex-col items-center justify-center px-4 py-12 relative">
      <h1 className="text-white text-6xl font-bold mb-12">GESPRO</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        <BotonInicio
          titulo="Dashboard"
          icono={LayoutDashboard}
          link="/dashboard"
          columnas={2}
        />
        <BotonInicio
          titulo="Proveedores"
          icono={Handshake}
          link="/proveedores"
        />
        <BotonInicio titulo="Artículos" icono={Package} link="/articulos" />
        <BotonInicio
          titulo="Órdenes de compra"
          icono={FileText}
          link="/ordenesdecompra"
        />
        <BotonInicio titulo="Ventas" icono={ArrowRightLeft} link="/ventas" />
        <BotonInicio titulo="Team" icono={UserRound} link="/team" />
      </div>

      {/* Foco Asistente */}
      <div className="fixed bottom-10 right-8 z-50 group cursor-pointer">
        {/* Círculo con foco */}
        <div className="bg-violet-300 w-22 h-22 rounded-full flex items-center justify-center shadow-xl ring-2 ring-white ring-opacity-50 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 animate-bounce-slow">
          <img
            src="/foco.png"
            alt="Foco GESPRO"
            className="w-18 h-18 object-contain transition-transform duration-500 group-hover:rotate-18"
          />
        </div>

        <div className="absolute -top-8 right-28 bg-white px-4 py-3 rounded-lg shadow-lg text-base font-medium text-gray-800 w-fit min-w-[200px] break-words transition-all duration-500 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100">
          {frasesFoco[mensajeIndex]}
          <div className="absolute right-[-8px] top-5 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-white" />
        </div>
      </div>
    </div>
  );
}
