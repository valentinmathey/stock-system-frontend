"use client";
import { usePathname } from "next/navigation";

type Props = {
  valor: string;
  onBuscar: (valor: string) => void;
  showSearch?: boolean;   // <-- nuevo prop opcional
};

export function Topbar({
  valor,
  onBuscar,
  showSearch = true,      // por defecto la mostramos
}: Props) {
  const pathname = usePathname();

  // placeholder dinámico según ruta
  const placeholder = (() => {
    if (pathname.startsWith("/articulos")) return "Buscar artículos...";
    if (pathname.startsWith("/proveedores"))
      return "Buscar proveedores...";
    if (pathname.startsWith("/ordenesdecompra"))
      return "Buscar órdenes de compra...";
    if (pathname.startsWith("/ventas")) return "Buscar ventas...";
    return "Buscar...";
  })();

  return (
    <header className="w-full bg-white shadow-sm px-4 py-4 flex items-center gap-4">
      {showSearch && (
        <input
          type="text"
          placeholder={placeholder}
          value={valor}
          onChange={(e) => onBuscar(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black"
        />
      )}
    </header>
  );
}
