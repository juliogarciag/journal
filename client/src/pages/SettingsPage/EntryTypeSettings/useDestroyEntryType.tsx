import fetchApi from "fetchApi";
import { useMutation, useQueryClient } from "react-query";

function useDestroyEntryType() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values: { id: number }) => {
      const response = await fetchApi(`/entry_types/${values.id}`, {
        method: "DELETE",
        body: {
          entryType: values,
        },
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

export default useDestroyEntryType;