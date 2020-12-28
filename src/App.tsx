import React, {
  ReactNode,
  RefObject,
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

function TimePieceInput() {
  return (
    <input
      type="number"
      min="0"
      max="11"
      className="border rounded-lg border-gray-400 w-12 px-1 text-center"
    />
  );
}

function TimeInput() {
  return (
    <div>
      <TimePieceInput /> : <TimePieceInput />
      <select className="ml-1" defaultValue="am">
        <option>am</option>
        <option>pm</option>
      </select>
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

  return (
    <div
      className="absolute z-50 w-full pb-8 bg-white shadow-xl border border-gray-200 border-solid"
      ref={bubbleRef}
    >
      <h3 className="py-4 text-2xl">{day.toFormat("EEEE, MMM. d, y")}</h3>

      <form className="text-left px-8 pt-4">
        <DailyActivity emoji="☀️" title="Wake up time">
          <TimeInput />
        </DailyActivity>
        <DailyActivity emoji="💪" title="Workout?">
          <Button>Yes 👌</Button>
          <Button>No 🙈</Button>
        </DailyActivity>
        <DailyActivity emoji="🦷" title="Did you brush your teeth?">
          <Button>Yes 👌</Button>
          <Button>No 🙈</Button>
        </DailyActivity>
        <DailyActivity emoji="😌" title="Skin Care?">
          <Button>Yes 👌</Button>
          <Button>No 🙈</Button>
        </DailyActivity>
        <DailyActivity emoji="🦖" title="Kraken Releases">
          <Button>↓</Button>
          <code className="p-1">0</code>
          <Button>↑</Button>
        </DailyActivity>
        <DailyActivity emoji="🌙" title="Sleep time">
          <TimeInput />
        </DailyActivity>
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
          <DayBubble
            day={openDay}
            currentDaySlotRef={currentDaySlotRef}
            closeDaySlot={closeDaySlot}
          />
        ) : null}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="text-center">
      {times(12).map((month) => {
        return <CalendarMonth key={month} year={2021} month={month + 1} />;
      })}
    </div>
  );
}

export default App;
