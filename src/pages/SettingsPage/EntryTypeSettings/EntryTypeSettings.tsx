import {
  closestCenter,
  DndContext,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Button, { VariantType } from "components/atoms/Button";
import Spacer from "components/atoms/Spacer";
import fetchApi from "fetchApi";
import { MouseEvent, useCallback, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { EntryTypeType } from "types";
import EntryTypeBlock from "./EntryTypeBlock";
import NewEntryTypeForm from "./NewEntryTypeForm";
import useUpdateEntryType from "./useUpdateEntryType";

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
    }),
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

  const [showCreationForm, setShowCreationForm] = useState(false);

  const displayCreationForm = useCallback(() => setShowCreationForm(true), []);
  const hideCreationForm = useCallback(() => setShowCreationForm(false), []);

  const updateEntryTypeMutation = useUpdateEntryType({
    bypassOptimisticUpdate: true,
  });

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
              attributes: { rowOrderPosition: overIndex },
            });
          }
        }
      }
    },
    [queryClient, updateEntryTypeMutation]
  );

  return (
    <>
      <div className="flex">
        <h1 className="text-2xl">Entry Types</h1>
        {showCreationForm ? null : (
          <Button
            variant={VariantType.Outstanding}
            className="ml-auto px-2"
            onClick={displayCreationForm}
          >
            Create new type
          </Button>
        )}
      </div>
      {showCreationForm ? (
        <>
          <Spacer className="h-6" />
          <NewEntryTypeForm onCancel={hideCreationForm} />
        </>
      ) : null}
      <Spacer className="h-12" />
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
    </>
  );
}

export default EntryTypeSettings;
