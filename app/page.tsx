import { BotonInicio } from "@/components/Inicio/BotonInicio";
import { ArrowRightLeft, FileText, Handshake, LayoutDashboard, Package, UserRound } from "lucide-react";

export default function Home(){
  return(
    <div className="min-h-screen w-full bg-gradient-to-br from-[#6805F2] to-[#D001FF] flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-white text-6xl font-bold mb-12" >GESPRO</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          <BotonInicio titulo="Dashboard" icono={LayoutDashboard} link="/dashboard" columnas={2} />
          <BotonInicio titulo="Proveedores" icono={Handshake} link="/proveedores" />
          <BotonInicio titulo="Artículos" icono={Package} link="/articulos" />
          <BotonInicio titulo="Órdenes de compra" icono={FileText} link="/ordenesdecompra" />
          <BotonInicio titulo="Ventas" icono={ArrowRightLeft} link="/ventas" />
          <BotonInicio titulo="Team" icono={UserRound} link="/team" />
        </div>
    </div>
  )
}