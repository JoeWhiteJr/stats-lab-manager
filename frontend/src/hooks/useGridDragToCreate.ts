import { useState, useRef, useCallback, useEffect } from 'react';
import { TIME_CONFIG } from '../components/calendar/types';

interface DragState {
  isDragging: boolean;
  startY: number;
  currentY: number;
  columnIndex: number;
}

interface UseGridDragToCreateOptions {
  hourHeight: number;
  gridRef: React.RefObject<HTMLElement | null>;
  onRangeSelected: (startTime: Date, endTime: Date) => void;
  getDateForColumn?: (columnIndex: number) => Date | null;
  baseDate?: Date;
}

function snapTo15Min(totalMinutes: number): number {
  return Math.round(totalMinutes / 15) * 15;
}

function clampHour(hour: number): number {
  return Math.max(TIME_CONFIG.START_HOUR, Math.min(TIME_CONFIG.END_HOUR + 1, hour));
}

function yToTime(y: number, hourHeight: number, baseDate: Date): Date {
  const fractionalHour = y / hourHeight + TIME_CONFIG.START_HOUR;
  const clampedHour = clampHour(fractionalHour);
  const totalMinutes = snapTo15Min(Math.round(clampedHour * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function useGridDragToCreate({
  hourHeight,
  gridRef,
  onRangeSelected,
  getDateForColumn,
  baseDate = new Date(),
}: UseGridDragToCreateOptions) {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const justDraggedRef = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const onMouseDown = useCallback(
    (e: React.MouseEvent, columnIndex: number = 0) => {
      // Only handle left click on the grid background
      if (e.button !== 0) return;
      // Don't start drag on event blocks
      if ((e.target as HTMLElement).closest('[data-event-block]')) return;

      const grid = gridRef.current;
      if (!grid) return;

      const rect = grid.getBoundingClientRect();
      const y = e.clientY - rect.top;

      dragStartPos.current = { x: e.clientX, y: e.clientY };

      // Store the initial position; we'll enter drag mode once the mouse moves enough
      setDragState({
        isDragging: false,
        startY: y,
        currentY: y,
        columnIndex,
      });
    },
    [gridRef]
  );

  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const grid = gridRef.current;
      if (!grid || !dragStartPos.current) return;

      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const rect = grid.getBoundingClientRect();
      const currentY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

      if (distance > 5 || isDraggingRef.current) {
        isDraggingRef.current = true;
        setDragState((prev) =>
          prev ? { ...prev, isDragging: true, currentY } : null
        );
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current && dragState) {
        const grid = gridRef.current;
        if (grid) {
          const minY = Math.min(dragState.startY, dragState.currentY);
          const maxY = Math.max(dragState.startY, dragState.currentY);

          const date = getDateForColumn
            ? getDateForColumn(dragState.columnIndex) || baseDate
            : baseDate;

          const startTime = yToTime(minY, hourHeight, date);
          const endTime = yToTime(maxY, hourHeight, date);

          // Enforce at least 15 minutes
          if (endTime.getTime() - startTime.getTime() >= 15 * 60 * 1000) {
            onRangeSelected(startTime, endTime);
          }
        }

        justDraggedRef.current = true;
        requestAnimationFrame(() => {
          justDraggedRef.current = false;
        });
      }

      isDraggingRef.current = false;
      dragStartPos.current = null;
      setDragState(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, gridRef, hourHeight, onRangeSelected, getDateForColumn, baseDate]);

  const getPreviewStyle = useCallback(() => {
    if (!dragState?.isDragging) return null;
    const minY = Math.min(dragState.startY, dragState.currentY);
    const maxY = Math.max(dragState.startY, dragState.currentY);

    // Snap preview to 15-min increments
    const startFrac = minY / hourHeight + TIME_CONFIG.START_HOUR;
    const endFrac = maxY / hourHeight + TIME_CONFIG.START_HOUR;
    const snappedStartMin = snapTo15Min(Math.round(clampHour(startFrac) * 60));
    const snappedEndMin = snapTo15Min(Math.round(clampHour(endFrac) * 60));

    const snappedTop = (snappedStartMin / 60 - TIME_CONFIG.START_HOUR) * hourHeight;
    const snappedHeight = ((snappedEndMin - snappedStartMin) / 60) * hourHeight;

    return {
      top: snappedTop,
      height: Math.max(snappedHeight, hourHeight / 4),
      columnIndex: dragState.columnIndex,
    };
  }, [dragState, hourHeight]);

  return {
    dragState,
    justDraggedRef,
    onMouseDown,
    getPreviewStyle,
  };
}
