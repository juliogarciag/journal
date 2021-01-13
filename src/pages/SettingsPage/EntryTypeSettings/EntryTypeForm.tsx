import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import { useCallback, useState } from "react";
import { EntryTypeType } from "types";

type EntryTypeFormProps = {
  entryType?: EntryTypeType;
  onCancel: () => void;
  save: (attributes: Partial<EntryTypeType>) => Promise<unknown>;
};
function EntryTypeForm({ onCancel, entryType, save }: EntryTypeFormProps) {
  const [name, setName] = useState(entryType?.name || "");
  const [dataType, setDataType] = useState(entryType?.dataType || "boolean");

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      await save({
        name,
        dataType,
      });

      onCancel();
    },
    [save, name, dataType, onCancel]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="py-4">
        <label className="flex items-center">
          <span className="w-24">Name </span>
          <input
            type="text"
            className="border border-gray-300 rounded w-48 px-2 py-1"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />
        </label>
        <Spacer className="h-4" />
        <label className="flex items-center">
          <span className="w-24">Data Type </span>
          <div className="relative">
            <select
              defaultValue={dataType}
              onChange={(event) => setDataType(event.currentTarget.value)}
              className="appearance-none w-48 px-2 py-1 border border-gray-300"
            >
              <option value="boolean">Yes / No</option>
              <option value="time">Time</option>
              <option value="quantity">Quantity</option>
            </select>
            <div className="absolute top-1 right-2 pointer-events-none">
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
          </div>
        </label>
      </div>
      <div className="flex border-t pt-4">
        <Button
          type="submit"
          className="bg-green-600 text-white border-green-600 px-4 py-1"
        >
          Save
        </Button>
        <Spacer className="w-2" />
        <Button
          type="button"
          className="bg-white text-gray-800 px-4 py-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default EntryTypeForm;
