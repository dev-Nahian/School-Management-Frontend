import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export interface FilterBarProps {
  filters: FilterGroup[];
  onReset?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onReset, className }) => {
  const hasActiveFilters = filters.some((f) => f.value !== '' && f.value !== 'ALL');

  return (
    <div className={cn('flex flex-wrap items-center gap-3 p-3 glass-panel rounded-2xl border border-gray-800 bg-gray-950/40', className)}>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mr-1">
        <Filter className="h-3.5 w-3.5 text-purple-400" />
        <span>Filters</span>
      </div>

      {filters.map((filter) => (
        <div key={filter.id} className="flex items-center gap-1.5">
          <label className="text-[11px] text-gray-400 font-mono hidden sm:inline">{filter.label}:</label>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-gray-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-purple-500/50"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {hasActiveFilters && onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 ml-auto px-2 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
