import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}) => {
  if (totalPages <= 1) return null;

  const startItem = pageSize ? (page - 1) * pageSize + 1 : undefined;
  const endItem = pageSize && totalItems ? Math.min(page * pageSize, totalItems) : undefined;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 glass-panel rounded-2xl border border-gray-800 text-xs">
      <div className="text-gray-400 text-center sm:text-left">
        {startItem && endItem && totalItems ? (
          <span>
            Showing <strong className="text-white">{startItem}</strong>-
            <strong className="text-white">{endItem}</strong> of{' '}
            <strong className="text-white">{totalItems}</strong> entries
          </span>
        ) : (
          <span>
            Page <strong className="text-white">{page}</strong> of{' '}
            <strong className="text-white">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 gap-1 text-xs px-2.5"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        {/* Page buttons */}
        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = page;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 rounded-xl text-xs font-mono font-medium transition-all ${
                  page === pageNum
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 gap-1 text-xs px-2.5"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
