import { DateTime } from "luxon";
import { FormEvent, useCallback } from "react";

type TimePieceInputProps = {
  value: number;
  onChange: (text: string) => void;
  max: number;
};
function TimePieceInput({ value, onChange, max }: TimePieceInputProps) {
  function handleChange(event: FormEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value);
  }

  return (
    <input
      type="number"
      min="0"
      max={max}
      className="border rounded-lg border-gray-400 w-12 px-1 text-center"
      value={value}
      onChange={handleChange}
    />
  );
}

type TimeInputProps = { value: string; onChange: (value: string) => void };
function TimeInput({ value, onChange }: TimeInputProps) {
  let hourPart: number;
  let minutePart: number;
  let meridiemPart: string;

  if (value) {
    const dateTime = DateTime.fromFormat(value, "t");
    [hourPart, minutePart, meridiemPart] = [
      Number(dateTime.toFormat("h")),
      Number(dateTime.toFormat("m")),
      dateTime.toFormat("a").toLowerCase(),
    ];
  } else {
    [hourPart, minutePart, meridiemPart] = [0, 0, "am"];
  }

  const handleHourChange = useCallback(
    (hour) => {
      const newValue = `${hour}:${minutePart} ${meridiemPart}`;
      onChange(newValue);
    },
    [minutePart, meridiemPart, onChange]
  );
  const handleMinuteChange = useCallback(
    (minute) => {
      const newValue = `${hourPart}:${minute} ${meridiemPart}`;
      onChange(newValue);
    },
    [hourPart, meridiemPart, onChange]
  );
  const handleMeridianChange = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      const newValue = `${hourPart}:${minutePart} ${event.currentTarget.value}`;
      onChange(newValue);
    },
    [hourPart, minutePart, onChange]
  );

  return (
    <div>
      <TimePieceInput value={hourPart} onChange={handleHourChange} max={11} /> :{" "}
      <TimePieceInput
        value={minutePart}
        onChange={handleMinuteChange}
        max={59}
      />
      <select
        className="ml-1"
        value={meridiemPart}
        onChange={handleMeridianChange}
      >
        <option>am</option>
        <option>pm</option>
      </select>
    </div>
  );
}

export default TimeInput;
