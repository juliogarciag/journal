import { DateTime } from "luxon";
import { useMemo } from "react";

function useToday(params) {
  // const today = DateTime.local().startOf("day");
  const today = useMemo(() => DateTime.local(2021, 1, 20).startOf("day"), []);
  return today;
}

export default useToday;
