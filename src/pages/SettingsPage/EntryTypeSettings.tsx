import {
  closestCenter,
  DndContext,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import Button from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import EntryTypeIcon from "components/EntryTypeIcon";
import fetchApi from "fetchApi";
import {
  CSSProperties,
  Fragment,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { useQuery, useQueryClient } from "react-query";
import { EntryTypeType } from "types";
import useUpdateEntryType from "./useUpdateEntryType";

type ButtonSelectOption = {
  value: string;
  text: ReactNode;
  disabled?: boolean;
};
type ButtonSelectProps = {
  value: string;
  options: Array<ButtonSelectOption>;
  onChange: any;
};
function ButtonSelect({ options, value, onChange }: ButtonSelectProps) {
  const selectedClassNames = "text-sm font-bold text-white bg-green-600";
  const unselectedClassNames =
    "text-sm bg-white border border-solid border-gray-300";

  const [selectedValue, setSelectedValue] = useState<string>(value);

  const selectOption = useCallback(
    (option: ButtonSelectOption) => {
      if (!option.disabled) {
        setSelectedValue(option.value);
        if (option.value !== value) {
          onChange(option.value);
        }
      }
    },
    [onChange, value]
  );

  return (
    <div className="p-2 flex">
      {options.map((option, index) => {
        const isSelected = option.value === selectedValue;
        const shouldAddSpacer = index < options.length - 1;

        return (
          <Fragment key={index}>
            <Button
              variant="empty"
              className={clsx({
                [selectedClassNames]: isSelected,
                [unselectedClassNames]: !isSelected,
                "text-gray-400 cursor-not-allowed": option.disabled,
              })}
              onClick={() => selectOption(option)}
              {...(option.disabled
                ? { title: "This type has entries that could be affected" }
                : {})}
            >
              {option.text}
            </Button>
            {shouldAddSpacer ? <Spacer className="w-2" /> : null}
          </Fragment>
        );
      })}
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

  const [newName, setNewName] = useState(entryType.name);

  const updateEntryTypeMutation = useUpdateEntryType();

  const handleNameBlur = useCallback(() => {
    if (newName === "") {
      setNewName(entryType.name);
    } else if (newName !== entryType.name) {
      updateEntryTypeMutation.mutate({
        id: entryType.id,
        key: "name",
        value: newName,
      });
    }
  }, [newName, entryType, updateEntryTypeMutation]);

  const handleNameKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.currentTarget.blur();
      }
    },
    []
  );

  const updateDataType = useCallback(
    (value: string) => {
      updateEntryTypeMutation.mutate({
        id: entryType.id,
        key: "dataType",
        value,
      });
    },
    [updateEntryTypeMutation, entryType]
  );

  return (
    <>
      <div
        ref={setNodeRef}
        className="flex flex-row py-2 pr-6 pl-2 border rounded-lg text-lg bg-white"
        style={style}
        {...attributes}
        {...listeners}
      >
        <div className="flex flex-col">
          <input
            type="text"
            className="text-xl w-96 p-2 border-2 border-dashed"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
          />
          <ButtonSelect
            options={[
              {
                value: "boolean",
                text: "Yes / No",
                disabled:
                  entryType.dataType !== "boolean" && entryType.hasEntries,
              },
              {
                value: "time",
                text: "Time",
                disabled: entryType.dataType !== "time" && entryType.hasEntries,
              },
              {
                value: "quantity",
                text: "Quantity",
                disabled:
                  entryType.dataType !== "quantity" && entryType.hasEntries,
              },
            ]}
            value={entryType.dataType}
            onChange={updateDataType}
          />
        </div>
        <div className="ml-auto flex items-center">
          <EntryTypeIcon
            icon={entryType.icon}
            color={entryType.iconColor}
            size="2x"
          />
        </div>
      </div>
      <Spacer className="h-4" />
    </>
  );
}

class EventForgivingMouseSensor extends MouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: (event: MouseEvent) => {
        const { button } = event;
        const isRightClick = button === 2;

        if (isRightClick) {
          return false;
        }

        // Difference with super class is that this doesn't prevent default events
        return true;
      },
    },
  ];
}

function EntryTypeSettings() {
  const fetchEntryTypes = useCallback(async () => {
    const response = await fetchApi("/entry_types");
    return response.json();
  }, []);

  const { data } = useQuery("entryTypes", fetchEntryTypes);
  const entryTypes: Array<EntryTypeType> = data.entryTypes;
  const entryTypesIds = entryTypes.map((entryType) => entryType.id.toString());

  const sensors = useSensors(
    useSensor(EventForgivingMouseSensor, {
      // Require the mouse to move by 10 pixels before activating
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const [draggingEntryTypeId, setDraggingEntryTypeId] = useState<number | null>(
    null
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggingEntryTypeId(Number(event.active.id));
  }, []);

  const updateEntryTypeMutation = useUpdateEntryType();

  const queryClient = useQueryClient();
  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (active && over) {
        setDraggingEntryTypeId(null);
      }

      if (active && over && active.id !== over.id) {
        const previousQueryData = queryClient.getQueryData<{
          entryTypes: Array<EntryTypeType>;
        }>("entryTypes");

        if (previousQueryData) {
          const previousEntryTypes = previousQueryData.entryTypes;

          const activeEntryType = previousEntryTypes.find(
            ({ id }) => id.toString() === active.id
          );
          const overEntryType = previousEntryTypes.find(
            ({ id }) => id.toString() === over.id
          );

          if (activeEntryType && overEntryType) {
            const activeIndex = previousEntryTypes.indexOf(activeEntryType);
            const overIndex = previousEntryTypes.indexOf(overEntryType);

            const updatedList = arrayMove(
              previousEntryTypes,
              activeIndex,
              overIndex
            );

            queryClient.setQueryData("entryTypes", {
              entryTypes: updatedList,
            });

            updateEntryTypeMutation.mutate({
              id: activeEntryType.id,
              key: "rowOrderPosition",
              value: overIndex,
            });
          }
        }
      }
    },
    [queryClient, updateEntryTypeMutation]
  );

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={entryTypesIds}
          strategy={verticalListSortingStrategy}
        >
          {entryTypes.map((entryType: EntryTypeType) => {
            return (
              <EntryTypeBlock
                key={entryType.id}
                entryType={entryType}
                isBeingDragged={entryType.id === draggingEntryTypeId}
              />
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default EntryTypeSettings;
