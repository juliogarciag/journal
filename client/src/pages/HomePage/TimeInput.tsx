import { FormEvent, useCallback } from "react";

type TimeInputProps = { value: string; onChange: (value: string) => void };
function TimeInput({ value, onChange }: TimeInputProps) {
  const handleChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      onChange(event.currentTarget.value);
    },
    [onChange]
  );

  return (
    <input
      type="time"
      className="appearance-none border rounded-lg border-gray-400 w-24 px-1"
      value={value}
      onChange={handleChange}
    />
  );
}

export default TimeInput;
