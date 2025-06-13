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
};
export function GesProInputNumber({
  label,
  name,
  handleChange,
  required = true,
}: GesProInputProps) {
  return (
    <>
      <label className="font-medium">{label}</label>
      <input
        type="number"
        name={name}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
        required={required}
      />
    </>
  );
}
