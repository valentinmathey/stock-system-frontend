"use client";

import { CardIntegrante } from "@/components/Team/CardIntegrante";
import Link from "next/link";

export default function TeamPage() {
  const integrantes = [
    { nombre: "Bautista Alos", imagen: "/equipo/bautista.png" },
    { nombre: "Lautaro Quiros", imagen: "/equipo/lautaro.png" },
    { nombre: "Valentín Mathey", imagen: "/equipo/valentin.png" },
    { nombre: "Joaquín Rodríguez", imagen: "/equipo/joaquin.png" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#6805F2] to-[#D001FF] flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-white text-5xl font-bold mb-10 text-center">Nuestro equipo</h1>

      <div className="flex flex-wrap justify-center gap-10 mb-12">
        {integrantes.map((i) => (
          <CardIntegrante key={i.nombre} {...i} />
        ))}
      </div>

      <Link
        href="/"
        className="bg-white text-[#6805F2] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-[#f5f5f5] transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
