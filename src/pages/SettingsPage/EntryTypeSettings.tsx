import {
  closestCenter,
  DndContext,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Spacer from "components/atoms/Spacer";
import EntryTypeIcon from "components/EntryTypeIcon";
import fetchApi from "fetchApi";
import { CSSProperties, useCallback, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { EntryTypeType } from "types";
import useUpdateEntryType from "./useUpdateEntryType";

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

  return (
    <>
      <div
        ref={setNodeRef}
        className="flex flex-row p-4 border rounded-lg text-lg bg-white"
        style={style}
        {...attributes}
        {...listeners}
      >
        <div className="flex flex-col">
          <div className="">{entryType.name}</div>
          <div className="italic">{entryType.dataType}</div>
        </div>
        <div className="ml-auto flex items-center">
          <EntryTypeIcon
            icon={entryType.icon}
            color={entryType.iconColor}
            size="lg"
          />
        </div>
      </div>
      <Spacer className="h-2" />
    </>
  );
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
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
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

      setDraggingEntryTypeId(null);

      if (active.id !== over.id) {
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
