type Proveedor = {
  id: number;
  nombreProveedor: string;
  cuitProveedor: string;
  telefonoProveedor: string;
  correoProveedor: string;
  direccionProveedor: string;
};


type Props = {
  proveedores: Proveedor[];
};

export function ProveedorCard({ proveedores }: Props) {
  return (
    <div className="w-full overflow-x-auto rounded shadow bg-white">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">CUIT</th>
            <th className="px-4 py-3 text-left">Teléfono</th>
            <th className="px-4 py-3 text-left">Correo</th>
            <th className="px-4 py-3 text-left">Dirección</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((p) => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-medium">{p.nombreProveedor}</td>
              <td className="px-4 py-2">{p.cuitProveedor}</td>
              <td className="px-4 py-2">{p.telefonoProveedor}</td>
              <td className="px-4 py-2">{p.correoProveedor}</td>
              <td className="px-4 py-2">{p.direccionProveedor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
