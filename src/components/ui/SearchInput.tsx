import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onSearchChange,
  placeholder = 'Search...',
  className,
  ...props
}) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-sm', className)}>
      <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-xs bg-gray-950/60 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
        {...props}
      />
      {value && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute right-2.5 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
          type="button"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
