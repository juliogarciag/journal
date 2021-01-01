import { useCallback, useRef, useState } from "react";
import { DateTime, Info } from "luxon";
import useMonthSlots from "useMonthSlots";
import DaySlot from "./DaySlot";
import DayBubble from "./DayBubble";
import noop from "lib/noop";
import { useQueryClient } from "react-query";
import { fetchDailyEntries, getQueryKey } from "./useDailyEntries";

type CalendarMonthProps = { year: number; month: number };
function CalendarMonth({ year, month }: CalendarMonthProps) {
  const slots = useMonthSlots(year, month);
  const monthName = Info.months()[month - 1];
  const weekdays = Info.weekdays("short");

  const [openDay, setOpenDay] = useState<DateTime | null>(null);
  const currentDaySlotRef = useRef<HTMLDivElement | null>(null);

  const closeDaySlot = useCallback(() => {
    currentDaySlotRef.current = null;
    setOpenDay(null);
  }, []);

  const openDaySlot = useCallback(
    ({
      day,
      daySlotElement,
    }: {
      day: DateTime;
      daySlotElement: HTMLDivElement;
    }) => {
      currentDaySlotRef.current = daySlotElement;
      setOpenDay(day);
    },
    []
  );

  const queryClient = useQueryClient();
  const prefetchDaySlot = useCallback(
    (day: DateTime) => {
      const queryKey = getQueryKey(day);
      queryClient.prefetchQuery(
        queryKey,
        () => {
          return fetchDailyEntries(day);
        },
        { staleTime: 5000 }
      );
    },
    [queryClient]
  );

  return (
    <div className="p-8">
      <h2 className="text-2xl">{monthName}</h2>
      <div className="p-4" />
      <div className="grid grid-cols-7 w-fit-content m-auto relative">
        {weekdays.map((weekday) => {
          return (
            <div key={weekday} className="p-4 uppercase font-bold">
              {weekday}
            </div>
          );
        })}
        {slots.map(({ day }, index) => {
          return (
            <div
              key={index}
              className="p-2 self-center justify-self-center w-12 h-12"
              onMouseOver={day ? () => prefetchDaySlot(day) : noop}
            >
              {day ? (
                <DaySlot
                  day={day}
                  openDaySlot={openDaySlot}
                  closeDaySlot={closeDaySlot}
                  isOpen={!!openDay && day.equals(openDay)}
                />
              ) : (
                ""
              )}
            </div>
          );
        })}
        {openDay ? (
          <DayBubble
            day={openDay}
            currentDaySlotRef={currentDaySlotRef}
            closeDaySlot={closeDaySlot}
          />
        ) : null}
      </div>
    </div>
  );
}

export default CalendarMonth;
