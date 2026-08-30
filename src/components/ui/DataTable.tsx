import React from 'react';
import { TableSkeleton } from './Skeleton';
import { EmptyState } from './EmptyState';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records matching your criteria.',
  pagination,
  keyExtractor,
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-950/40">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-950/90 text-gray-400 border-b border-gray-800 uppercase font-mono text-[10px]">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`p-3.5 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-gray-800/30 transition-all">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={`p-3.5 ${col.className || ''}`}>
                    {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey]) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-3 glass-panel rounded-2xl border border-gray-800 text-xs">
          <span className="text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="gap-1 text-xs h-8"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="gap-1 text-xs h-8"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
