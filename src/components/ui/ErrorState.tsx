import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load content',
  message = 'An unexpected error occurred while processing your request. Please try again.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 glass-panel rounded-2xl border border-rose-500/30 bg-rose-500/5 my-4 text-center ${
        className || ''
      }`}
    >
      <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400 max-w-md mb-4">{message}</p>

      {onRetry && (
        <Button
          onClick={onRetry}
          size="sm"
          variant="outline"
          className="gap-2 text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
