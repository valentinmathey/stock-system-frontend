export function GesProInputText({
  label,
  name,
  handleChange,
  required = true,
}: GesProInputProps) {
  return (
    <>
      <label className="font-medium">{label}</label>
      <input
        name={name}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
        required={required}
      />
    </>
  );
}
type GesProInputProps = {
  name?: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
  label: string;
  helperText?: React.ReactNode;
};
export function GesProInputNumber({
  label,
  name,
  handleChange,
  required = true,
  helperText,
}: GesProInputProps) {
  return (
    <>
      <label className="font-medium">{label}
              {helperText && (
        <div className="inline-block bg-gray-100 text-gray-700 mt-1 px-2 py-1 rounded shadow-sm text-xs">
          {helperText}
        </div>
      )}
      </label>
      <input
        type="number"
        min={0}
        name={name}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
        required={required}
        
      />

    </>
  );
}
