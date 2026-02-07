import { Filter, X } from 'lucide-react';

interface CalendarFiltersProps {
  projects: { id: string; title: string }[];
  categories: { id: string; name: string; color: string }[];
  filters: { projectId: string | null; categoryId: string | null };
  onFilterChange: (filters: { projectId?: string | null; categoryId?: string | null }) => void;
}

export function CalendarFilters({ projects, categories, filters, onFilterChange }: CalendarFiltersProps) {
  const hasFilters = filters.projectId || filters.categoryId;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Filter size={16} className="text-gray-400" />

      <select
        value={filters.projectId || ''}
        onChange={(e) => onFilterChange({ projectId: e.target.value || null })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="">All Projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.title}</option>
        ))}
      </select>

      <select
        value={filters.categoryId || ''}
        onChange={(e) => onFilterChange({ categoryId: e.target.value || null })}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={() => onFilterChange({ projectId: null, categoryId: null })}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        >
          <X size={14} /> Clear
        </button>
      )}
    </div>
  );
}

export default CalendarFilters;
