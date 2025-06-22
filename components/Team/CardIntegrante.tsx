interface CardIntegranteProps {
  nombre: string;
  imagen: string;
}

export function CardIntegrante({ nombre, imagen }: CardIntegranteProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center transition-transform hover:scale-105">
      <img src={imagen} alt={nombre} className="w-64 h-64 rounded-full object-cover mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 text-center">{nombre}</h3>
    </div>
  );
}
