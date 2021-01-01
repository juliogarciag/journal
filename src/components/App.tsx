import React from "react";
import times from "lib/times";
import { QueryClient, QueryClientProvider } from "react-query";
import CalendarMonth from "./CalendarMonth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="text-center">
        {times(12).map((month) => {
          return <CalendarMonth key={month} year={2021} month={month + 1} />;
        })}
      </div>
    </QueryClientProvider>
  );
}

export default App;
