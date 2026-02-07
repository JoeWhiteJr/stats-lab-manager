import { useMemo } from 'react';
import { startOfWeek, addDays, isSameDay, isToday, format } from 'date-fns';
import type { CalendarEvent, DeadlineEvent } from './types';
import { TIME_CONFIG } from './types';

interface WeeklyViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  deadlines: DeadlineEvent[];
  hourHeight: number;
  onTimeClick: (time: Date) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onMoveEvent: (id: string, start_time: string, end_time: string) => void;
  onSelectDate: (date: Date) => void;
  scope: 'lab' | 'personal';
}

export function WeeklyView({
  selectedDate, events, deadlines, hourHeight,
  onTimeClick, onEditEvent, onSelectDate,
}: WeeklyViewProps) {
  const weekStart = useMemo(() => startOfWeek(selectedDate, { weekStartsOn: 0 }), [selectedDate]);
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) days.push(addDays(weekStart, i));
    return days;
  }, [weekStart]);

  const hours = useMemo(() => {
    const h: number[] = [];
    for (let i = TIME_CONFIG.START_HOUR; i <= TIME_CONFIG.END_HOUR; i++) h.push(i);
    return h;
  }, []);

  const blocksByDay = useMemo(() => {
    return weekDays.map((day) => ({
      date: day,
      blocks: events.filter((e) => isSameDay(new Date(e.start_time), day)),
    }));
  }, [weekDays, events]);

  const gridHeight = (TIME_CONFIG.END_HOUR - TIME_CONFIG.START_HOUR + 1) * hourHeight;

  const getBlockStyle = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    const top = (startHour - TIME_CONFIG.START_HOUR) * hourHeight;
    const height = Math.max((endHour - startHour) * hourHeight, hourHeight / 4);
    return { top, height };
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return '12a';
    if (hour < 12) return `${hour}a`;
    if (hour === 12) return '12p';
    return `${hour - 12}p`;
  };

  // Current time indicator
  const now = new Date();

  return (
    <div className="flex flex-col bg-white">
      {/* Week Header */}
      <div className="flex border-b border-gray-200">
        <div className="w-14 flex-shrink-0" />
        {weekDays.map((day, index) => {
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day)}
              className={`flex-1 py-2 text-center transition-colors ${
                selected ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="text-[0.65rem] font-medium uppercase tracking-wide text-gray-400 mb-0.5">
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-medium relative ${
                selected ? 'text-indigo-600' : 'text-gray-900'
              }`}>
                {format(day, 'd')}
                {today && !selected && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time Grid */}
      <div className="flex-1 overflow-auto">
        <div className="flex relative" style={{ height: gridHeight }}>
          {/* Hour Labels */}
          <div className="w-14 flex-shrink-0 relative">
            {hours.map((hour) => (
              <div
                key={hour}
                className="absolute left-0 w-14 pr-2 text-right"
                style={{ top: (hour - TIME_CONFIG.START_HOUR) * hourHeight }}
              >
                <span className="text-xs text-gray-400 -mt-2 block">{formatHour(hour)}</span>
              </div>
            ))}
          </div>

          {/* Day Columns */}
          {blocksByDay.map(({ date, blocks }, dayIndex) => {
            const selected = isSameDay(date, selectedDate);
            const today = isToday(date);

            return (
              <div
                key={dayIndex}
                className={`flex-1 relative border-l border-gray-100 ${selected ? 'bg-indigo-50/30' : ''}`}
              >
                {/* Hour lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 border-t border-gray-100"
                    style={{ top: (hour - TIME_CONFIG.START_HOUR) * hourHeight }}
                  />
                ))}

                {/* Events */}
                {blocks.map((block) => {
                  const { top, height } = getBlockStyle(block.start_time, block.end_time);
                  const color = block.category_color || '#6366f1';
                  const isCompact = height < 40;

                  return (
                    <button
                      key={block.id}
                      onClick={() => onEditEvent(block)}
                      className="absolute left-0.5 right-0.5 rounded-lg px-1 py-0.5 text-left overflow-hidden transition-all hover:shadow-md"
                      style={{
                        top, height,
                        backgroundColor: `${color}20`,
                        borderLeft: `2px solid ${color}`,
                      }}
                    >
                      <div className={`font-medium text-gray-900 truncate ${isCompact ? 'text-[0.6rem]' : 'text-xs'}`}>
                        {block.title}
                      </div>
                    </button>
                  );
                })}

                {/* Current time line for today */}
                {today && (() => {
                  const nowTop = (now.getHours() + now.getMinutes() / 60 - TIME_CONFIG.START_HOUR) * hourHeight;
                  if (nowTop < 0) return null;
                  return (
                    <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top: nowTop }}>
                      <div className="h-0.5 bg-red-500" />
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WeeklyView;
