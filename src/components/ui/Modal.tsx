import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg',
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[95vw]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative w-full glass-panel rounded-3xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10',
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {/* Modal Header */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between p-6 border-b border-gray-800 shrink-0">
            <div>
              {title && <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
              aria-label="Close Modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {!title && !subtitle && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 z-20 transition-colors"
            aria-label="Close Modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>

        {/* Modal Footer */}
        {footer && (
          <div className="p-4 border-t border-gray-800 bg-gray-950/60 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
