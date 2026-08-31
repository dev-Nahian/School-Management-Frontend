import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading data...',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-md">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin mb-3" />
        <p className="text-xs font-mono text-gray-300 animate-pulse">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl border border-gray-800 my-4 text-center">
      <Loader2 className="h-8 w-8 text-purple-400 animate-spin mb-3" />
      <p className="text-xs font-mono text-gray-400 animate-pulse">{message}</p>
    </div>
  );
};
