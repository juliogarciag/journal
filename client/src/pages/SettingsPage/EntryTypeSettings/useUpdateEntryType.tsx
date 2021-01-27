import fetchApi from "fetchApi";
import produce from "immer";
import { useMutation, useQueryClient } from "react-query";
import { EntryType } from "types";

type EntryTypesQueryData = {
  entryTypes: Array<EntryType>;
};

function useUpdateEntryType({ bypassOptimisticUpdate = false } = {}) {
  const queryClient = useQueryClient();

  return useMutation(
    async (values: { id: Number; attributes: Partial<EntryType> }) => {
      const { id, attributes } = values;
      const response = await fetchApi(`/entry-types/${id}`, {
        method: "PATCH",
        body: { entryType: attributes },
      });
      return response.json();
    },
    {
      onMutate: (values: { id: Number; attributes: Partial<EntryType> }) => {
        if (bypassOptimisticUpdate) {
          return;
        }

        const { id, attributes } = values;
        const previousData = queryClient.getQueryData<EntryTypesQueryData>(
          "entryTypes"
        );

        if (previousData && previousData.entryTypes) {
          const { entryTypes } = previousData;

          queryClient.setQueryData<EntryTypesQueryData>("entryTypes", {
            entryTypes: produce(entryTypes, (draft) => {
              const entryType = draft.find((entryType) => entryType.id === id);
              if (entryType) {
                Object.assign(entryType, attributes);
              }
            }),
          });
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries("entryTypes");
      },
    }
  );
}

export default useUpdateEntryType;
