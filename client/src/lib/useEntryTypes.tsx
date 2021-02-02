import fetchApi from "fetchApi";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { EntryType } from "types";

function useEntryTypes() {
  const fetchEntryTypes = useCallback(async () => {
    const response = await fetchApi("/entry-types");
    return response.json();
  }, []);

  const { data } = useQuery("entryTypes", fetchEntryTypes);
  const entryTypes: Array<EntryType> = data.entryTypes;
  return entryTypes;
}

export default useEntryTypes;
