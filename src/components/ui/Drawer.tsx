import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: 'right' | 'left' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  position = 'right',
  size = 'md',
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

  const sizeClasses = {
    right: {
      sm: 'max-w-sm w-full',
      md: 'max-w-md w-full',
      lg: 'max-w-lg w-full',
      xl: 'max-w-xl w-full',
    },
    left: {
      sm: 'max-w-sm w-full',
      md: 'max-w-md w-full',
      lg: 'max-w-lg w-full',
      xl: 'max-w-xl w-full',
    },
    bottom: {
      sm: 'max-h-[50vh] w-full',
      md: 'max-h-[70vh] w-full',
      lg: 'max-h-[85vh] w-full',
      xl: 'max-h-[95vh] w-full',
    },
  };

  const positionClasses = {
    right: 'inset-y-0 right-0 border-l',
    left: 'inset-y-0 left-0 border-r',
    bottom: 'inset-x-0 bottom-0 border-t rounded-t-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed z-50 glass-panel bg-gray-900 border-gray-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out',
          positionClasses[position],
          sizeClasses[position][size]
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 shrink-0">
          <div>
            {title && <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">{children}</div>

        {/* Drawer Footer */}
        {footer && (
          <div className="p-4 border-t border-gray-800 bg-gray-950/60 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
