export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg z-50 relative w-full max-w-xl">
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-black">✕</button>
        {children}
      </div>
    </div>
  );
}
