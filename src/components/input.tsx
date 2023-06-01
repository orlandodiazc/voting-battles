import { useState } from "react";

export default function Input({
  id,
  value,
  changeValue,
}: {
  id: number;
  value: string;
  changeValue: (value: string, id: number) => void;
}) {
  const [internalValue, setValue] = useState(value);
  return (
    <input
      className="w-8 h-8 text-center bg-foreground text-background rounded"
      value={internalValue}
      onChange={(ev) => {
        setValue(ev.target.value);
        changeValue(ev.target.value, id);
      }}
    />
  );
}
