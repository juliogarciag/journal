import fetchApi from "fetchApi";
import { useMutation, useQueryClient } from "react-query";

function useUpdateEntryType() {
  const queryClient = useQueryClient();

  return useMutation(
    async (attributes: { id: Number; key: string; value: string | number }) => {
      const { id, key, value } = attributes;
      const response = await fetchApi(`/entry_types/${id}`, {
        method: "PATCH",
        body: { entryType: { [key]: value } },
      });
      return response.json();
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("entryTypes");
      },
    }
  );
}

export default useUpdateEntryType;
