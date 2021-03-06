import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Button, { VariantType } from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import EntryTypeIcon from "components/EntryTypeIcon";
import { Fragment, useCallback, useState } from "react";
import { EntryDataType, EntryType, EntryTypeIconType } from "types";

type IconSelectProps = {
  value: EntryTypeIconType;
  onChange: (icon: EntryTypeIconType) => void;
  className?: string;
};
function IconSelect({ value, onChange, className = "" }: IconSelectProps) {
  return (
    <div className={clsx("flex flex-wrap", className)}>
      {Object.values(EntryTypeIconType).map((icon) => {
        return (
          <Fragment key={icon}>
            <Button
              aria-label={`${icon} icon`}
              title={`${icon} icon`}
              className={clsx("border-2 py-1 px-1.5 rounded", {
                "border-green-600 focus:outline-none": icon === value,
              })}
              onClick={() => onChange(icon)}
            >
              <EntryTypeIcon icon={icon} />
            </Button>
            <Spacer className="w-3" />
          </Fragment>
        );
      })}
    </div>
  );
}

type EntryTypeFormProps = {
  entryType?: EntryType;
  onCancel: () => void;
  save: (attributes: Partial<EntryType>) => Promise<unknown>;
};
function EntryTypeForm({ onCancel, entryType, save }: EntryTypeFormProps) {
  const [name, setName] = useState(entryType?.name || "");
  const [dataType, setDataType] = useState(
    entryType?.dataType || EntryDataType.BOOLEAN
  );
  const [icon, setIcon] = useState(
    entryType?.icon || EntryTypeIconType.Unknown
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      await save({
        name,
        dataType,
        icon,
      });

      onCancel();
    },
    [save, name, dataType, icon, onCancel]
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
              onChange={(event) =>
                setDataType(event.currentTarget.value as EntryDataType)
              }
              className="appearance-none w-48 px-2 py-1 border border-gray-300"
            >
              <option value={EntryDataType.BOOLEAN}>Yes / No</option>
              <option value={EntryDataType.TIME}>Time</option>
              <option value={EntryDataType.QUANTITY}>Quantity</option>
            </select>
            <div className="absolute top-1 right-2 pointer-events-none">
              <FontAwesomeIcon icon={faCaretDown} />
            </div>
          </div>
        </label>
        <Spacer className="h-4" />
        <div className="flex items-center">
          <label className="w-24">Icon </label>
          <IconSelect
            value={icon}
            onChange={setIcon}
            className="border border-transparent rounded px-0.5 py-1 w-96"
          />
        </div>
      </div>
      <div className="flex border-t pt-4">
        <Button
          type="submit"
          variant={VariantType.Solid}
          className="bg-green-600 text-white border-green-600 px-4 py-1 rounded-full"
        >
          Save
        </Button>
        <Spacer className="w-2" />
        <Button
          variant={VariantType.Solid}
          className="bg-white text-gray-800 px-4 py-1 rounded-full"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default EntryTypeForm;
