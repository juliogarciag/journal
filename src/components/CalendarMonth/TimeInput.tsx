import { DateTime } from "luxon";
import { FormEvent, useCallback } from "react";
import "./TimeInput.css";

type TimePieceInputProps = {
  value: number;
  onChange: (text: string | null) => void;
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
      pattern="[0-9]*"
      inputMode="numeric"
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
      const newValue = `${hour || 0}:${minutePart} ${meridiemPart}`;
      onChange(newValue);
    },
    [minutePart, meridiemPart, onChange]
  );
  const handleMinuteChange = useCallback(
    (minute) => {
      const newValue = `${hourPart}:${minute || 0} ${meridiemPart}`;
      onChange(newValue);
    },
    [hourPart, meridiemPart, onChange]
  );
  const handleMeridianChange = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      const newValue = `${hourPart}:${minutePart} ${
        event.currentTarget.value || "am"
      }`;
      onChange(newValue);
    },
    [hourPart, minutePart, onChange]
  );

  return (
    <div className="flex">
      <TimePieceInput value={hourPart} onChange={handleHourChange} max={11} />
      <span className="mx-1"> : </span>
      <TimePieceInput
        value={minutePart}
        onChange={handleMinuteChange}
        max={59}
      />
      <div className="meridian-select-wrapper ml-1">
        <select
          className="appearance-none bg-transparent px-2 border-none w-full"
          value={meridiemPart}
          onChange={handleMeridianChange}
        >
          <option value="am">am</option>
          <option value="pm">pm</option>
        </select>
      </div>
    </div>
  );
}

export default TimeInput;
