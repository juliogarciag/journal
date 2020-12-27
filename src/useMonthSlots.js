import { DateTime } from "luxon";
import { useMemo } from "react";
import times from "./lib/times";

const WEEK_DAYS_COUNT = 7;
const MAX_WEEKS_PER_MONTH = 5;

function useMonthDays(year, month) {
  const firstDayOfMonth = useMemo(() => DateTime.local(year, month, 1), [
    year,
    month,
  ]);

  const lastDayOfMonth = useMemo(
    () => firstDayOfMonth.plus({ month: 1 }).minus({ day: 1 }),
    [firstDayOfMonth]
  );

  const monthDays = useMemo(() => {
    let days = [];
    let lastDay = firstDayOfMonth;
    while (!lastDay.equals(lastDayOfMonth)) {
      days.push(lastDay);
      lastDay = lastDay.plus({ day: 1 });
    }
    days.push(lastDayOfMonth);
    return days;
  }, [firstDayOfMonth, lastDayOfMonth]);

  return monthDays;
}

function createEmptySlot() {
  return { day: null, isEmpty: true };
}

function useMonthSlots(year, month) {
  const monthDays = useMonthDays(year, month);

  return useMemo(() => {
    const allSlotsCount = WEEK_DAYS_COUNT * MAX_WEEKS_PER_MONTH;
    const firstWeekday = monthDays[0].weekday;
    const trailingSlotsCount = firstWeekday - 1;
    const leadingSlotsCount =
      allSlotsCount - (trailingSlotsCount + monthDays.length);

    const daySlots = monthDays.map((day) => {
      return { day, isEmpty: false };
    });

    return times(trailingSlotsCount, createEmptySlot)
      .concat(daySlots)
      .concat(times(leadingSlotsCount, createEmptySlot));
  }, [monthDays]);
}

export default useMonthSlots;
