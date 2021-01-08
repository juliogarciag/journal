import { DateTime } from "luxon";
import { useCallback } from "react";
import { useQueryClient } from "react-query";
import { fetchDailyEntries, getQueryKey } from "./useDailyEntries";

function usePrefetchDay() {
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

  return prefetchDaySlot;
}

export default usePrefetchDay;
