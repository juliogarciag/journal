import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faCaretDown,
  faClock,
  faEdit,
  faSortNumericUpAlt,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import EntryTypeIcon from "components/EntryTypeIcon";
import { CSSProperties, useCallback, useState } from "react";
import { EntryTypeType } from "types";
import useUpdateEntryType from "./useUpdateEntryType";

const dataTypeCopies: { [key: string]: string } = {
  boolean: "Yes / No",
  time: "Time",
  quantity: "Quantity",
};

const dataTypeIcons: { [key: string]: IconProp } = {
  boolean: faToggleOn,
  time: faClock,
  quantity: faSortNumericUpAlt,
};

type EditEntryFormProps = {
  exitEditMode: () => void;
  entryType: EntryTypeType;
};
function EditEntryForm({ exitEditMode, entryType }: EditEntryFormProps) {
  const updateEntryTypeMutation = useUpdateEntryType();

  const [name, setName] = useState(entryType.name);
  const [dataType, setDataType] = useState(entryType.dataType);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      await updateEntryTypeMutation.mutateAsync({
        id: entryType.id,
        attributes: {
          name,
          dataType,
        },
      });
      exitEditMode();
    },
    [updateEntryTypeMutation, entryType, name, dataType, exitEditMode]
  );

  return (
    <div className="px-4 py-2 border-t">
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
            onClick={exitEditMode}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

function EntryTypeBlock({
  entryType,
  isBeingDragged,
}: {
  entryType: EntryTypeType;
  isBeingDragged: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: entryType.id.toString() });

  const style: CSSProperties = {
    position: "relative",
    transition,
  };

  if (transform) {
    style.transform = CSS.Transform.toString(transform);
    style.zIndex = isBeingDragged ? 999999 : -1;
  }

  const [inEditMode, setInEditMode] = useState(false);

  const goIntoEditMode = useCallback(() => {
    setInEditMode(true);
  }, [setInEditMode]);

  const exitEditMode = useCallback(() => {
    setInEditMode(false);
  }, [setInEditMode]);

  return (
    <>
      <div
        ref={setNodeRef}
        className="flex flex-col border rounded-lg bg-white shadow-md"
        style={style}
      >
        <div className="flex flex-row text-lg">
          <Button
            variant="empty"
            className="flex items-center px-4 text-gray-400 hover:text-gray-500"
            style={{ cursor: isBeingDragged ? "grabbing" : "grab" }}
            {...listeners}
            {...attributes}
          >
            <FontAwesomeIcon icon={faBars} className="fill-current" />
          </Button>
          <Button
            variant="empty"
            className="flex flex-row w-full pr-6 py-2"
            title="Edit Type"
            onClick={goIntoEditMode}
          >
            <div className="flex flex-col">
              <div className="w-96 p-2 pb-0 flex flex-row">
                <div className="text-xl">{entryType.name}</div>
                <div className="pl-2">
                  <FontAwesomeIcon
                    icon={faEdit}
                    size="xs"
                    className="fill-current text-gray-700"
                  />{" "}
                </div>
              </div>
              <div className="p-2 text-gray-800 text-sm flex items-center">
                <FontAwesomeIcon
                  icon={dataTypeIcons[entryType.dataType]}
                  className="fill-current"
                />
                <span className="pl-2">
                  {dataTypeCopies[entryType.dataType]}
                </span>{" "}
              </div>
            </div>
            <div className="ml-auto flex flex-col self-center">
              <EntryTypeIcon
                icon={entryType.icon}
                color={entryType.iconColor}
                size="2x"
              />
            </div>
          </Button>
        </div>
        {inEditMode ? (
          <EditEntryForm exitEditMode={exitEditMode} entryType={entryType} />
        ) : null}
      </div>
      <Spacer className="h-4" />
    </>
  );
}

export default EntryTypeBlock;
