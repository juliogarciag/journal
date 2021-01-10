import fetchApi from "fetchApi";
import { useMutation } from "react-query";

function useUpdateEntryType() {
  return useMutation(
    async (attributes: { id: Number; key: string; value: string | number }) => {
      const { id, key, value } = attributes;
      const response = await fetchApi(`/entry_types/${id}`, {
        method: "PATCH",
        body: { entryType: { [key]: value } },
      });
      return response.json();
    }
  );
}

export default useUpdateEntryType;
