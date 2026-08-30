import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const getButtonClass = () => {
    if (variant === 'danger') return 'bg-rose-600 hover:bg-rose-500 text-white';
    if (variant === 'warning') return 'bg-amber-600 hover:bg-amber-500 text-white';
    return 'bg-purple-600 hover:bg-purple-500 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-gray-800 bg-gray-900 shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white mb-1">{title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">{message}</p>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isLoading}
                className="text-xs border-gray-800 text-gray-300"
              >
                {cancelLabel}
              </Button>
              <Button
                size="sm"
                onClick={onConfirm}
                disabled={isLoading}
                className={`text-xs ${getButtonClass()}`}
              >
                {isLoading ? 'Processing...' : confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
