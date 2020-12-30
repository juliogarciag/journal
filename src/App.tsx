import React, {
  FormEvent,
  ReactNode,
  RefObject,
  Suspense,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DateTime, Info } from "luxon";
import useMonthSlots from "./useMonthSlots";
import times from "./lib/times";
import useToday from "./useToday";
import Button from "./atoms/Button";
import useOnClickOutside from "./useOnClickOutside";
import useGlobalKeyHandler from "./useGlobalKeyHandler";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

const API_BASE_URL = "http://localhost:3000";

type DaySlotProps = {
  day: DateTime;
  openDaySlot: (toggleOptions: {
    day: DateTime;
    daySlotElement: HTMLDivElement;
  }) => void;
  closeDaySlot: () => void;
  isOpen: boolean;
};
function DaySlot({ day, openDaySlot, closeDaySlot, isOpen }: DaySlotProps) {
  const today = useToday();
  const daySlotRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (event) => {
      if (day <= today && daySlotRef.current) {
        if (isOpen) {
          closeDaySlot();
        } else {
          openDaySlot({
            day,
            daySlotElement: daySlotRef.current,
          });
          event.preventDefault();
          event.stopPropagation();
        }
      }
    },
    [day, today, isOpen, openDaySlot, closeDaySlot]
  );

  let extraStyles = "text-current bg-transparent";

  if (today.equals(day)) {
    extraStyles = "cursor-pointer text-white bg-green-500 hover:bg-green-600";
  } else if (day > today) {
    extraStyles = "text-gray-300 bg-transparent font-medium";
  } else {
    extraStyles = "cursor-pointer hover:bg-green-100";
  }

  if (isOpen) {
    extraStyles += " bg-green-600 hover:bg-green-600 text-white";
  }

  return (
    <div
      className={`rounded-full p-1 w-full h-full ${extraStyles}`}
      onClick={handleClick}
      ref={daySlotRef}
    >
      {day.day}
    </div>
  );
}

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

type TimePieceInputProps = {
  value: number;
  onChange: (text: string) => void;
  max: number;
};
function TimePieceInput({ value, onChange, max }: TimePieceInputProps) {
  function handleChange(event: FormEvent<HTMLInputElement>) {
    onChange(event.currentTarget.value);
  }

  return (
    <input
      type="number"
      min="0"
      max={max}
      className="border rounded-lg border-gray-400 w-12 px-1 text-center"
      value={value}
      onChange={handleChange}
    />
  );
}

type TimeInputProps = { value: string; onChange: (value: string) => void };
function TimeInput({ value, onChange }: TimeInputProps) {
  let hourPart: number;
  let minutePart: number;
  let meridiemPart: string;

  if (value) {
    const dateTime = DateTime.fromFormat(value, "t");
    [hourPart, minutePart, meridiemPart] = [
      Number(dateTime.toFormat("h")),
      Number(dateTime.toFormat("m")),
      dateTime.toFormat("a").toLowerCase(),
    ];
  } else {
    [hourPart, minutePart, meridiemPart] = [0, 0, "am"];
  }

  const handleHourChange = useCallback(
    (hour) => {
      const newValue = `${hour}:${minutePart} ${meridiemPart}`;
      onChange(newValue);
    },
    [minutePart, meridiemPart, onChange]
  );
  const handleMinuteChange = useCallback(
    (minute) => {
      const newValue = `${hourPart}:${minute} ${meridiemPart}`;
      onChange(newValue);
    },
    [hourPart, meridiemPart, onChange]
  );
  const handleMeridianChange = useCallback(
    (event: FormEvent<HTMLSelectElement>) => {
      const newValue = `${hourPart}:${minutePart} ${event.currentTarget.value}`;
      onChange(newValue);
    },
    [hourPart, minutePart, onChange]
  );

  return (
    <div>
      <TimePieceInput value={hourPart} onChange={handleHourChange} max={11} /> :{" "}
      <TimePieceInput
        value={minutePart}
        onChange={handleMinuteChange}
        max={59}
      />
      <select
        className="ml-1"
        value={meridiemPart}
        onChange={handleMeridianChange}
      >
        <option>am</option>
        <option>pm</option>
      </select>
    </div>
  );
}

type BooleanInputProps = {
  value: boolean | null;
  onChange: (value: boolean | null) => void;
};
function BooleanInput({ value, onChange }: BooleanInputProps) {
  const handleYesClick = useCallback(() => {
    if (value === true) {
      onChange(null);
    } else {
      onChange(true);
    }
  }, [value, onChange]);

  const handleNoClick = useCallback(() => {
    if (value === false) {
      onChange(null);
    } else {
      onChange(false);
    }
  }, [value, onChange]);

  return (
    <>
      <Button
        onClick={handleYesClick}
        variant={value === true ? "outstanding" : "default"}
      >
        Yes 👌
      </Button>
      <Button
        onClick={handleNoClick}
        variant={value === false ? "outstanding" : "default"}
      >
        No 🙈
      </Button>
    </>
  );
}

type QuantityInputProps = { value: number; onChange: (value: number) => void };
function QuantityInput({ value, onChange }: QuantityInputProps) {
  const handleDownClick = useCallback(() => {
    onChange(value - 1);
  }, [onChange, value]);

  const handleUpClick = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);

  return (
    <>
      <Button onClick={handleDownClick}>↓</Button>
      <code className="p-1">{value}</code>
      <Button onClick={handleUpClick}>↑</Button>
    </>
  );
}

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

type DayBubbleProps = {
  day: DateTime;
  currentDaySlotRef: RefObject<HTMLDivElement>;
  closeDaySlot: () => void;
};
function DayBubble({ day, currentDaySlotRef, closeDaySlot }: DayBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  const fetchDailyEntries = useCallback(async () => {
    const response = await fetch(
      API_BASE_URL + "/daily-entries/" + day.toISODate()
    );
    return response.json();
  }, [day]);

  const dailyEntriesQueryKey = ["entries", day.toISODate()];
  const { data } = useQuery(dailyEntriesQueryKey, fetchDailyEntries);
  const entries: Array<EntryType> = data.entries;

  useOnClickOutside(closeDaySlot, [bubbleRef, currentDaySlotRef]);
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

      await fetch(API_BASE_URL + "/entries/" + entry.id, {
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

type CalendarMonthProps = { year: number; month: number };
function CalendarMonth({ year, month }: CalendarMonthProps) {
  const slots = useMonthSlots(year, month);
  const monthName = Info.months()[month - 1];
  const weekdays = Info.weekdays("short");

  const [openDay, setOpenDay] = useState<DateTime | null>(null);
  const currentDaySlotRef = useRef<HTMLDivElement | null>(null);

  const closeDaySlot = useCallback(() => {
    currentDaySlotRef.current = null;
    setOpenDay(null);
  }, []);

  const openDaySlot = useCallback(
    ({
      day,
      daySlotElement,
    }: {
      day: DateTime;
      daySlotElement: HTMLDivElement;
    }) => {
      currentDaySlotRef.current = daySlotElement;
      setOpenDay(day);
    },
    []
  );

  return (
    <div className="p-8">
      <h2 className="text-2xl">{monthName}</h2>
      <div className="p-4" />
      <div className="grid grid-cols-7 w-fit-content m-auto relative">
        {weekdays.map((weekday) => {
          return (
            <div key={weekday} className="p-4 uppercase font-bold">
              {weekday}
            </div>
          );
        })}
        {slots.map(({ day }, index) => {
          return (
            <div
              key={index}
              className="p-2 self-center justify-self-center w-12 h-12"
            >
              {day ? (
                <DaySlot
                  day={day}
                  openDaySlot={openDaySlot}
                  closeDaySlot={closeDaySlot}
                  isOpen={!!openDay && day.equals(openDay)}
                />
              ) : (
                ""
              )}
            </div>
          );
        })}
        {openDay ? (
          <Suspense fallback={<div>Loading...</div>}>
            <DayBubble
              day={openDay}
              currentDaySlotRef={currentDaySlotRef}
              closeDaySlot={closeDaySlot}
            />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="text-center">
          {times(12).map((month) => {
            return <CalendarMonth key={month} year={2021} month={month + 1} />;
          })}
        </div>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
