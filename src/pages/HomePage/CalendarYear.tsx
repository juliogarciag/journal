import { useEffect } from "react";
import usePrefetchDay from "./usePrefetchDay";
import useToday from "lib/useToday";
import times from "lib/times";
import CalendarMonth from "./CalendarMonth";
import { Info } from "luxon";

const MONTHS_PER_YEAR = Info.months().length;

function CalendarYear({ year }: { year: number }) {
  const today = useToday();
  const prefetchDay = usePrefetchDay();

  useEffect(() => {
    prefetchDay(today);
  }, [prefetchDay, today]);

  return (
    <div className="text-center">
      {times(MONTHS_PER_YEAR).map((month) => {
        return <CalendarMonth key={month} year={2021} month={month + 1} />;
      })}
    </div>
  );
}

export default CalendarYear;
