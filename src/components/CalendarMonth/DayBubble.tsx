import { ReactNode, RefObject, useLayoutEffect, useRef } from "react";
import { DateTime } from "luxon";
import { useMutation, useQueryClient } from "react-query";
import useGlobalKeyHandler from "lib/useGlobalKeyHandler";
import TimeInput from "./TimeInput";
import BooleanInput from "./BooleanInput";
import QuantityInput from "./QuantityInput";
import useDailyEntries, { getQueryKey } from "./useDailyEntries";
import fetchApi from "fetchApi";

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
      <div className="flex gap-3">{children}</div>
    </div>
  );
}

type DayBubbleProps = {
  day: DateTime;
  currentDaySlotRef: RefObject<HTMLDivElement>;
  closeDaySlot: () => void;
};
function DayBubble({ day, currentDaySlotRef, closeDaySlot }: DayBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  const dailyEntriesQueryKey = getQueryKey(day);
  const { data } = useDailyEntries(day);
  const entries: Array<EntryType> = data.entries;

  useGlobalKeyHandler("Escape", closeDaySlot);

  useLayoutEffect(() => {
    if (bubbleRef.current && currentDaySlotRef.current) {
      const bubble = bubbleRef.current;
      const slot = currentDaySlotRef.current;
      bubble.style.top = `calc(${slot.offsetTop + slot.offsetHeight}px + 1em)`;
      bubble.style.left = "0px";
    }
  });

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
    <div
      className="absolute z-50 w-full pb-8 bg-white shadow-xl border border-gray-200 border-solid"
      ref={bubbleRef}
    >
      <h3 className="py-4 text-2xl">{day.toFormat("EEEE, MMM. d, y")}</h3>

      <form className="text-left px-8 pt-4">
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
    </div>
  );
}

export default DayBubble;
