import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-panel rounded-2xl border border-dashed border-gray-800 bg-gray-950/40 my-4">
      <div className="p-3 rounded-full bg-purple-500/10 border border-purple-500/20 mb-3 text-purple-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400 max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="text-xs bg-purple-600 hover:bg-purple-500">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
