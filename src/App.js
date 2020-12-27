import React, { useMemo } from "react";
import { DateTime, Info } from "luxon";

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

function identity(x) {
  return x;
}

function times(n, transform = identity) {
  const array = [];
  for (let i = 0; i < n; i++) {
    array.push(transform(i));
  }
  return array;
}

const WEEK_DAYS_COUNT = 7;
const MAX_WEEKS_PER_MONTH = 5;

function useFullMonthSlots(year, month) {
  const monthDays = useMonthDays(year, month);

  return useMemo(() => {
    const allSlotsCount = WEEK_DAYS_COUNT * MAX_WEEKS_PER_MONTH;
    const firstWeekday = monthDays[0].weekday;
    const trailingEmptySlotsCount = firstWeekday - 1;
    const leadingEmptySlotsCount =
      allSlotsCount - (trailingEmptySlotsCount + monthDays.length);

    const daySlots = monthDays.map((day) => {
      return { day, isEmpty: false };
    });

    const createEmptySlot = () => ({ day: null, isEmpty: true });

    return times(trailingEmptySlotsCount, createEmptySlot)
      .concat(daySlots)
      .concat(times(leadingEmptySlotsCount, createEmptySlot));
  }, [monthDays]);
}

function CalendarMonth({ year, month }) {
  const slots = useFullMonthSlots(year, month);

  return (
    <div>
      <h2>{Info.months()[month - 1]}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${WEEK_DAYS_COUNT}, 1fr)`,
          width: "fit-content",
        }}
      >
        {Info.weekdays("short").map((weekday) => {
          return (
            <div style={{ padding: "1em", textTransform: "uppercase" }}>
              {weekday}
            </div>
          );
        })}
        {slots.map(({ isEmpty, day }, index) => {
          return (
            <div
              key={index}
              style={{
                padding: "0.5em",
                alignSelf: "center",
                justifySelf: "center",
              }}
            >
              {isEmpty ? "" : day.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>2021</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {times(12).map((month) => {
          return <CalendarMonth key={month} year={2021} month={month + 1} />;
        })}
      </div>
    </div>
  );
}

export default App;
