import { useDraggable } from '@dnd-kit/core';
import type { CalendarEvent } from './types';
import { TIME_CONFIG } from './types';

interface EventBlockProps {
  event: CalendarEvent;
  hourHeight: number;
  onEdit: (event: CalendarEvent) => void;
}

export function EventBlock({ event, hourHeight, onEdit }: EventBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: { startTime: event.start_time, endTime: event.end_time },
  });

  const start = new Date(event.start_time);
  const end = new Date(event.end_time);

  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;

  const top = (startHour - TIME_CONFIG.START_HOUR) * hourHeight;
  const height = Math.max((endHour - startHour) * hourHeight, hourHeight / 4);
  const isCompact = height < 40;

  const color = event.category_color || '#6366f1';

  const formatTime = (d: Date) => {
    const h = d.getHours();
    const m = d.getMinutes();
    const period = h >= 12 ? 'p' : 'a';
    const hour = h % 12 || 12;
    return m === 0 ? `${hour}${period}` : `${hour}:${m.toString().padStart(2, '0')}${period}`;
  };

  const style: React.CSSProperties = {
    position: 'absolute',
    top,
    height,
    left: '4px',
    right: '4px',
    backgroundColor: `${color}20`,
    borderLeft: `3px solid ${color}`,
    zIndex: isDragging ? 50 : 10,
    opacity: isDragging ? 0.8 : 1,
    transform: transform ? `translate(0, ${transform.y}px)` : undefined,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      onClick={(e) => { e.stopPropagation(); onEdit(event); }}
      className="rounded-lg px-2 py-1 overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className={`font-medium text-gray-900 truncate ${isCompact ? 'text-[0.6rem]' : 'text-xs'}`}>
        {event.title}
      </div>
      {!isCompact && (
        <>
          <div className="text-[0.65rem] text-gray-500">
            {formatTime(start)} - {formatTime(end)}
          </div>
          {event.project_title && (
            <div className="text-[0.6rem] text-gray-400 truncate mt-0.5">
              {event.project_title}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EventBlock;
