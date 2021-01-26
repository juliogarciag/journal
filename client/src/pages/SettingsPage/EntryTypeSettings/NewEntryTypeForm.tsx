import { useCallback } from "react";
import EntryTypeForm from "./EntryTypeForm";
import useCreateNewEntryType from "./useCreateNewEntryType";

type NewEntryTypeFormProps = {
  onCancel: () => void;
};
function NewEntryTypeForm({ onCancel }: NewEntryTypeFormProps) {
  const createNewEntryTypeMutation = useCreateNewEntryType();

  const createNewEntryType = useCallback(
    async (attributes) => {
      return await createNewEntryTypeMutation.mutateAsync(attributes);
    },
    [createNewEntryTypeMutation]
  );

  return (
    <div className="pt-2 py-4 px-4 border rounded-md shadow-md">
      <EntryTypeForm onCancel={onCancel} save={createNewEntryType} />
    </div>
  );
}

export default NewEntryTypeForm;
