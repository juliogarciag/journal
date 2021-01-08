import useToday from "lib/useToday";
import { DateTime } from "luxon";
import { useCallback, useRef } from "react";
import usePrefetchDay from "./usePrefetchDay";

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
  const isEditable = day <= today;

  const daySlotRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
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

  const prefetchDay = usePrefetchDay();

  const handleMouseOver = useCallback(() => {
    if (isEditable) {
      prefetchDay(day);
    }
  }, [day, isEditable, prefetchDay]);

  let extraStyles = "text-current bg-transparent";

  if (today.equals(day)) {
    extraStyles = "cursor-pointer text-white bg-green-500 hover:bg-green-600";
  } else if (isEditable) {
    extraStyles = "cursor-pointer hover:bg-green-100";
  } else {
    extraStyles = "text-gray-300 bg-transparent font-medium";
  }

  if (isOpen) {
    extraStyles += " bg-green-600 hover:bg-green-600 text-white";
  }

  return (
    <div
      className={`rounded-full p-1 w-full h-full ${extraStyles}`}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      ref={daySlotRef}
    >
      {day.day}
    </div>
  );
}

export default DaySlot;
