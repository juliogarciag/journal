import fetchApi from "fetchApi";
import { useMutation, useQueryClient } from "react-query";

function useCreateNewEntryType() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values: { name: string; dataType: string; icon: string }) => {
      const response = await fetchApi(`/entry_types`, {
        method: "POST",
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

export default useCreateNewEntryType;
