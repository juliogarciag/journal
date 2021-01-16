import Button from "components/atoms/Button";
import fetchApi from "fetchApi";
import { ReactNode, Suspense, useCallback } from "react";
import { useQuery } from "react-query";
import { EntryTypeType } from "types";
import useDestroyEntryType from "./useDestroyEntryType";

function BlockContainer({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-400 p-4 text-white flex items-center">
      {children}
    </div>
  );
}

function EntryTypeDeletionBlock({ entryType }: { entryType: EntryTypeType }) {
  const fetchCanBeDeleted = useCallback(async () => {
    const response = await fetchApi(
      `/entry_types/${entryType.id}/can_be_deleted`
    );
    return response.json();
  }, [entryType]);

  const { data } = useQuery<{ canBeDeleted: boolean }>(
    ["canEntryTypeBeDeleted", entryType.id],
    fetchCanBeDeleted
  );

  const destroyEntryTypeMutation = useDestroyEntryType();
  const deleteEntryType = useCallback(() => {
    destroyEntryTypeMutation.mutate({ id: entryType.id });
  }, [destroyEntryTypeMutation, entryType]);

  return (
    <BlockContainer>
      {data && data.canBeDeleted ? (
        <>
          <p>Do you want to delete this type?</p>
          <div className="ml-auto">
            <Button
              className="bg-red-400 hover:bg-red-600 px-4 py-1 rounded-full"
              onClick={deleteEntryType}
            >
              Delete
            </Button>
          </div>
        </>
      ) : (
        <p>Types with entries can't be deleted.</p>
      )}
    </BlockContainer>
  );
}

function EntryTypeDeletionBlockLoader({
  entryType,
}: {
  entryType: EntryTypeType;
}) {
  return (
    <Suspense
      fallback={
        <BlockContainer>
          <p>Loading...</p>
        </BlockContainer>
      }
    >
      <EntryTypeDeletionBlock entryType={entryType} />
    </Suspense>
  );
}

// {/* {entryType.canBeDeleted ? (
//         <div className="bg-gray-400 p-4 text-white flex items-center">
//           <p>This type can be safely removed.</p>
// <div className="ml-auto">
//   <Button
//     variant="empty"
//     className="bg-red-400 hover:bg-red-600 px-4 py-1"
//   >
//     Delete
//   </Button>
// </div>
//         </div>
//       ) : null} */}

export default EntryTypeDeletionBlockLoader;
