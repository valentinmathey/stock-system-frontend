type Props = {
  titulo: string;
  children: React.ReactNode;
};

export function DashboardCard({ titulo, children }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 text-black">
      <h3 className="text-lg font-semibold mb-2">{titulo}</h3>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
