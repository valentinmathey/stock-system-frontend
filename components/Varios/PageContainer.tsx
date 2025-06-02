import { Sidebar } from "@/components/Layout/Sidebar";
import { Topbar } from "@/components/Layout/Topbar";

type Props = {
  children: React.ReactNode;
  valorBusqueda: string;
  onBuscar: (valor: string) => void;
};

export function PageContainer({ children, valorBusqueda, onBuscar }: Props) {
  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-50 overflow-y-auto">
        <Topbar valor={valorBusqueda} onBuscar={onBuscar} />
        <div className="p-6">{children}</div>
      </div>
    </main>
  );
}
