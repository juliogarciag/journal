import useToday from "lib/useToday";
import { DateTime } from "luxon";
import { useCallback, useRef } from "react";

type DaySlotProps = {
  day: DateTime;
  openDaySlot: (toggleOptions: {
    day: DateTime;
    daySlotElement: HTMLDivElement;
  }) => void;
  closeDaySlot: () => void;
  isOpen: boolean;
};
function DaySlot({ day, openDaySlot, closeDaySlot, isOpen }: DaySlotProps) {
  const today = useToday();
  const daySlotRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (event) => {
      if (day <= today && daySlotRef.current) {
        if (isOpen) {
          closeDaySlot();
        } else {
          openDaySlot({
            day,
            daySlotElement: daySlotRef.current,
          });
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },
    [day, today, isOpen, openDaySlot, closeDaySlot]
  );

  let extraStyles = "text-current bg-transparent";

  if (today.equals(day)) {
    extraStyles = "cursor-pointer text-white bg-green-500 hover:bg-green-600";
  } else if (day > today) {
    extraStyles = "text-gray-300 bg-transparent font-medium";
  } else {
    extraStyles = "cursor-pointer hover:bg-green-100";
  }

  if (isOpen) {
    extraStyles += " bg-green-600 hover:bg-green-600 text-white";
  }

  return (
    <div
      className={`rounded-full p-1 w-full h-full ${extraStyles}`}
      onMouseDown={handleMouseDown}
      ref={daySlotRef}
    >
      {day.day}
    </div>
  );
}

export default DaySlot;
