import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
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
import EntryTypeDeletionBlock from "./EntryTypeDeletionBlock";
import EntryTypeForm from "./EntryTypeForm";
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

  const updateEntryType = useCallback(
    async (attributes) => {
      return await updateEntryTypeMutation.mutateAsync({
        id: entryType.id,
        attributes,
      });
    },
    [updateEntryTypeMutation, entryType]
  );

  return (
    <div className="border-t">
      <div className="px-4 pt-2 pb-4">
        <EntryTypeForm
          entryType={entryType}
          onCancel={exitEditMode}
          save={updateEntryType}
        />
      </div>
      <EntryTypeDeletionBlock entryType={entryType} />
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
              <EntryTypeIcon icon={entryType.icon} size="2x" />
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
