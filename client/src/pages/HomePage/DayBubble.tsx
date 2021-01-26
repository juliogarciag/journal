import {
  ReactNode,
  RefObject,
  Suspense,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DateTime } from "luxon";
import { useMutation, useQueryClient } from "react-query";
import produce from "immer";
import useGlobalKeyHandler from "lib/useGlobalKeyHandler";
import TimeInput from "./TimeInput";
import BooleanInput from "./BooleanInput";
import QuantityInput from "./QuantityInput";
import useDailyEntries, { getQueryKey } from "./useDailyEntries";
import fetchApi from "fetchApi";
import Button, { VariantType } from "components/atoms/Button";
import { Entry, EntryTypeIconType, EntryValue } from "types";
import EntryTypeIcon from "components/EntryTypeIcon/EntryTypeIcon";
import useToday from "lib/useToday";

type EntriesQueryData = {
  entries: Array<Entry>;
};

type DailyActivityProps = {
  icon: EntryTypeIconType;
  title: string;
  children: ReactNode;
};
function DailyActivity({ icon, title, children }: DailyActivityProps) {
  return (
    <div className="flex items-center pb-4">
      <div className="font-semibold w-64">
        <span className="pr-2">
          <EntryTypeIcon icon={icon} />
        </span>
        <span>{title}</span>
      </div>
      <div className="flex">{children}</div>
    </div>
  );
}

function useUpdateEntry(day: DateTime) {
  const queryClient = useQueryClient();
  const dailyEntriesQueryKey = getQueryKey(day);
  const today = useToday();

  return useMutation(
    async (values: {
      entry: Entry;
      value: string | boolean | number | null;
    }) => {
      const { entry, value } = values;

      await fetchApi(`/entries/${entry.id}`, {
        method: "PATCH",
        body: { entry: { value } },
      });
    },
    {
      onMutate: async (values: { entry: Entry; value: EntryValue }) => {
        const { entry, value } = values;

        await queryClient.cancelQueries(dailyEntriesQueryKey);

        const previousData = queryClient.getQueryData<EntriesQueryData>(
          dailyEntriesQueryKey
        );

        if (previousData) {
          queryClient.setQueryData<EntriesQueryData>(
            dailyEntriesQueryKey,
            produce(previousData, (draft) => {
              const index = previousData.entries.findIndex(
                (e) => e.id === entry.id
              );
              const draftEntry = draft.entries[index];
              if (draftEntry) {
                draftEntry.value = value;
              }
            })
          );
        }

        return { previousData };
      },
      onError: (err, variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(dailyEntriesQueryKey, context.previousData);
        }
      },
      onSettled: () => {
        const metricsQueryKey = ["yearMetrics", today.year];

        queryClient.invalidateQueries(dailyEntriesQueryKey);
        queryClient.invalidateQueries(metricsQueryKey);
      },
    }
  );
}

type DayBubbleProps = {
  day: DateTime;
  closeDaySlot: () => void;
};
function DayBubble({ day, closeDaySlot }: DayBubbleProps) {
  const { data } = useDailyEntries(day);
  const entries: Array<Entry> = data.entries;

  useGlobalKeyHandler("Escape", closeDaySlot);

  const updateValueMutation = useUpdateEntry(day);

  return (
    <form className="text-left pt-4">
      {entries.map((entry) => {
        const { id, value, entryType } = entry;
        const { icon, name, dataType } = entryType;
        return (
          <DailyActivity key={id} icon={icon} title={name}>
            {dataType === "TIME" ? (
              <TimeInput
                value={(value as string) || ""}
                onChange={(value) => {
                  updateValueMutation.mutate({ entry, value });
                }}
              />
            ) : null}
            {dataType === "BOOLEAN" ? (
              <BooleanInput
                value={value as boolean | null}
                onChange={(value) => {
                  updateValueMutation.mutate({ entry, value });
                }}
              />
            ) : null}
            {dataType === "QUANTITY" ? (
              <QuantityInput
                value={(value as number) || 0}
                onChange={(value) => {
                  updateValueMutation.mutate({ entry, value });
                }}
              />
            ) : null}
          </DailyActivity>
        );
      })}
    </form>
  );
}

type BubbleTriangleProps = {
  side?: number;
  daySlotRef: RefObject<HTMLDivElement>;
};
function BubbleTriangle({ side = 16, daySlotRef }: BubbleTriangleProps) {
  const [left, setLeft] = useState<number>(0);

  useLayoutEffect(() => {
    const daySlot = daySlotRef.current;
    const daySlotWrapper = daySlot?.parentElement;

    if (daySlot && daySlotWrapper) {
      setLeft(daySlotWrapper.offsetLeft + daySlot.offsetWidth / 2 - 1);
    }
  }, [daySlotRef]);

  return (
    <div
      className="absolute"
      style={{
        top: -side,
        left,
        width: side,
        height: side,
      }}
    >
      <svg height="100%" width="100%" viewBox="0 0 100 100">
        <polyline
          points="1,99 50,0 99,99"
          className="triangle text-gray-900 stroke-current stroke-1"
          fill="#fff"
        />
      </svg>
    </div>
  );
}

interface DayBubbleWrapperProps extends DayBubbleProps {
  currentDaySlotRef: RefObject<HTMLDivElement>;
}
function DayBubbleWrapper(props: DayBubbleWrapperProps) {
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const { currentDaySlotRef, ...otherProps } = props;

  useLayoutEffect(() => {
    const bubble = bubbleRef.current;
    const slot = currentDaySlotRef.current;
    if (bubble && slot) {
      bubble.style.top = `calc(${slot.offsetTop + slot.offsetHeight}px + 1em)`;
      bubble.style.left = "0px";
    }
  });

  return (
    <div
      className="absolute z-50 w-full pt-6 pb-8 px-8 bg-white shadow-xl border border-gray-200 border-solid"
      ref={bubbleRef}
    >
      <BubbleTriangle
        key={props.day.toISODate()}
        daySlotRef={currentDaySlotRef}
      />
      <Button
        variant={VariantType.Solid}
        className="absolute right-8 px-4"
        onClick={props.closeDaySlot}
      >
        close
      </Button>
      <h3 className="text-2xl pb-4 text-left">
        {props.day.toFormat("EEEE, MMM. d, y")}
      </h3>
      <Suspense fallback={<div>Loading...</div>}>
        <DayBubble {...otherProps} />
      </Suspense>
    </div>
  );
}

export default DayBubbleWrapper;
