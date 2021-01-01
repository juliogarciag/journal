import { ReactNode, RefObject, Suspense, useLayoutEffect, useRef } from "react";
import { DateTime } from "luxon";
import { useMutation, useQueryClient } from "react-query";
import useGlobalKeyHandler from "lib/useGlobalKeyHandler";
import TimeInput from "./TimeInput";
import BooleanInput from "./BooleanInput";
import QuantityInput from "./QuantityInput";
import useDailyEntries, { getQueryKey } from "./useDailyEntries";
import fetchApi from "fetchApi";
import Button from "components/atoms/Button";

type EntryType = {
  id: number;
  entryTypeId: number;
  value: string | number | boolean;
  entryType: {
    id: number;
    name: string;
    emoji: string;
    dataType: string;
  };
};

type DailyActivityProps = { emoji: string; title: string; children: ReactNode };
function DailyActivity({ emoji, title, children }: DailyActivityProps) {
  return (
    <div className="flex items-center pb-4">
      <div className="font-semibold w-64">
        <span className="pr-2">{emoji}</span>
        <span>{title}</span>
      </div>
      <div className="flex">{children}</div>
    </div>
  );
}

type DayBubbleProps = {
  day: DateTime;
  closeDaySlot: () => void;
};
function DayBubble({ day, closeDaySlot }: DayBubbleProps) {
  const dailyEntriesQueryKey = getQueryKey(day);
  const { data } = useDailyEntries(day);
  const entries: Array<EntryType> = data.entries;

  useGlobalKeyHandler("Escape", closeDaySlot);

  const queryClient = useQueryClient();

  const updateValueMutation = useMutation(
    async (values: {
      entry: EntryType;
      value: string | boolean | number | null;
    }) => {
      const { entry, value } = values;

      await fetchApi(`/entries/${entry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ entry: { value } }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(dailyEntriesQueryKey);
      },
    }
  );

  return (
    <form className="text-left pt-4">
      {entries.map((entry) => {
        const { id, value, entryType } = entry;
        const { emoji, name, dataType } = entryType;
        return (
          <DailyActivity key={id} emoji={emoji} title={name}>
            {dataType === "time" ? (
              <TimeInput
                value={(value as string) || ""}
                onChange={(value) => {
                  updateValueMutation.mutate({ entry, value });
                }}
              />
            ) : null}
            {dataType === "boolean" ? (
              <BooleanInput
                value={value as boolean | null}
                onChange={(value) => {
                  updateValueMutation.mutate({ entry, value });
                }}
              />
            ) : null}
            {dataType === "quantity" ? (
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

interface DayBubbleWrapperProps extends DayBubbleProps {
  currentDaySlotRef: RefObject<HTMLDivElement>;
}

function DayBubbleWrapper(props: DayBubbleWrapperProps) {
  const bubbleRef = useRef<HTMLDivElement | null>(null);
  const { currentDaySlotRef, ...otherProps } = props;

  useLayoutEffect(() => {
    if (bubbleRef.current && currentDaySlotRef.current) {
      const bubble = bubbleRef.current;
      const slot = currentDaySlotRef.current;
      bubble.style.top = `calc(${slot.offsetTop + slot.offsetHeight}px + 1em)`;
      bubble.style.left = "0px";
    }
  });

  return (
    <div
      className="absolute z-50 w-full pt-6 pb-8 px-8 bg-white shadow-xl border border-gray-200 border-solid"
      ref={bubbleRef}
    >
      <Button className="absolute right-8 px-4" onClick={props.closeDaySlot}>
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
