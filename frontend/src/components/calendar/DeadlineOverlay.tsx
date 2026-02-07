import { AlertTriangle } from 'lucide-react';
import type { DeadlineEvent } from './types';

interface DeadlineOverlayProps {
  deadlines: DeadlineEvent[];
}

export function DeadlineOverlay({ deadlines }: DeadlineOverlayProps) {
  if (deadlines.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
      <div className="flex items-center gap-1 text-amber-700 text-xs font-medium w-full mb-1">
        <AlertTriangle size={14} />
        Upcoming Deadlines
      </div>
      {deadlines.slice(0, 5).map((dl) => (
        <div
          key={dl.id}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
            dl.completed
              ? 'bg-green-100 text-green-700 line-through'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          <span className="font-medium truncate max-w-[150px]">{dl.title}</span>
          {dl.project_title && (
            <span className="text-amber-500">({dl.project_title})</span>
          )}
        </div>
      ))}
      {deadlines.length > 5 && (
        <span className="text-xs text-amber-500">+{deadlines.length - 5} more</span>
      )}
    </div>
  );
}

export default DeadlineOverlay;
