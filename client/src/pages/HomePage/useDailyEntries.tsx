import fetchApi from "fetchApi";
import { DateTime } from "luxon";
import { useCallback } from "react";
import { useQuery } from "react-query";

async function fetchDailyEntries(day: DateTime) {
  const response = await fetchApi(`/daily-entries/${day.toISODate()}`);
  return response.json();
}

function getQueryKey(day: DateTime) {
  return ["entries", day.toISODate()];
}

function useDailyEntries(day: DateTime) {
  const queryKey = getQueryKey(day);

  const fetchDailyEntriesCallback = useCallback(() => {
    return fetchDailyEntries(day);
  }, [day]);

  return useQuery(queryKey, fetchDailyEntriesCallback);
}

export default useDailyEntries;
export { getQueryKey, fetchDailyEntries };
