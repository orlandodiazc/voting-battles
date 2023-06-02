export default function Input({
  id,
  value,
  changeValue,
}: {
  id: number;
  value: string;
  changeValue: (value: string, id: number) => void;
}) {
  return (
    <input
      className="w-8 h-8 text-center bg-foreground text-background rounded"
      value={value}
      onChange={(ev) => {
        changeValue(ev.target.value, id);
      }}
    />
  );
}
