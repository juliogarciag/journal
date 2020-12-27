import React, { useCallback, useRef, useState } from "react";
import { Info } from "luxon";
import useMonthSlots from "./useMonthSlots";
import times from "./lib/times";
import useToday from "./useToday";

function DaySlot({ day, toggleDaySlot, isOpen }) {
  const today = useToday();
  const dayRef = useRef();

  const handleClick = useCallback(() => {
    if (day <= today) {
      toggleDaySlot({
        day,
        x: dayRef.current.offsetLeft,
        y: dayRef.current.offsetTop,
      });
    }
  }, [day, today, toggleDaySlot]);

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
      ref={dayRef}
    >
      {day.day}
    </div>
  );
}

function DayBubble({ day, openDayPosition: { x, y } }) {
  return (
    <div
      className="absolute z-50 w-full h-96 bg-white border-2 border-gray-200 border-solid p-2"
      style={{
        top: y + 48,
        left: 0,
      }}
    >
      <h3>Day</h3>
    </div>
  );
}

function CalendarMonth({ year, month }) {
  const slots = useMonthSlots(year, month);
  const monthName = Info.months()[month - 1];
  const weekdays = Info.weekdays("short");

  const [openDay, setOpenDay] = useState(null);
  const [openDayPosition, setOpenDayPosition] = useState(null);

  const toggleDaySlot = ({ day, x, y }) => {
    if (openDay && openDay.equals(day)) {
      setOpenDay(null);
      setOpenDayPosition(null);
    } else {
      setOpenDayPosition({ x, y });
      setOpenDay(day);
    }
  };

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
        {slots.map(({ isEmpty, day }, index) => {
          return (
            <div
              key={index}
              className="p-2 self-center justify-self-center w-12 h-12"
            >
              {isEmpty ? (
                ""
              ) : (
                <DaySlot
                  day={day}
                  toggleDaySlot={toggleDaySlot}
                  isOpen={openDay && day.equals(openDay)}
                />
              )}
            </div>
          );
        })}
        {openDay ? (
          <DayBubble day={openDay} openDayPosition={openDayPosition} />
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
