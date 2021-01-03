import React, { useEffect } from "react";
import times from "lib/times";
import { QueryClient, QueryClientProvider } from "react-query";
import CalendarMonth from "./CalendarMonth";
import useToday from "lib/useToday";
import usePrefetchDay from "./CalendarMonth/usePrefetchDay";
import { Info } from "luxon";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CalendarYear year={2021} />
    </QueryClientProvider>
  );
}

export default App;
