import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PropsBotonInicio {
  titulo: string
  icono: LucideIcon
  link?: string
  columnas?: number
}

export function BotonInicio({ titulo, icono: Icono, link, columnas }: PropsBotonInicio) {
  const contenido = (
    <div
      className={cn(
        "rounded-3xl bg-gradient-to-br from-[#E726CD] to-[#7278F2] text-white flex flex-col items-center justify-center h-48 sm:h-56 lg:h-64 shadow-xl hover:scale-105 transition-transform",
        "w-full",
        columnas === 2 ? "lg:col-span-2 lg:col-start-1" : ""
      )}
    >
      <Icono size={90} />
      <span className="text-2xl font-bold mt-5">{titulo}</span>
    </div>
  )

  return link ? <Link href={link}>{contenido}</Link> : contenido
}

  