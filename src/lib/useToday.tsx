import { DateTime } from "luxon";

const globalDaysCache = new Map<string, DateTime>();

function useToday(): DateTime {
  const currentDateTime = DateTime.local();
  const dayKey = currentDateTime.toISODate();
  const cachedDateTime = globalDaysCache.get(dayKey);

  if (cachedDateTime) {
    return cachedDateTime;
  } else {
    const currentDay = currentDateTime.startOf("day");
    globalDaysCache.set(dayKey, currentDay);
    return currentDay;
  }
}

export default useToday;
