import React from 'react';
import { Card } from './card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    isNegative?: boolean;
    label?: string;
  };
  accentColor?: 'purple' | 'blue' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  accentColor = 'purple',
  className,
}) => {
  const accentStyles = {
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
  };

  return (
    <Card hoverEffect className={cn('relative overflow-hidden border border-gray-800 bg-gray-900/60 p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-white tracking-tight">{value}</p>
        </div>

        <div className={cn('p-3 rounded-2xl border shrink-0', accentStyles[accentColor])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(trend || description) && (
        <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive && (
                <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                  <TrendingUp className="h-3.5 w-3.5" /> +{trend.value}
                </span>
              )}
              {trend.isNegative && (
                <span className="flex items-center gap-0.5 text-rose-400 font-bold">
                  <TrendingDown className="h-3.5 w-3.5" /> -{trend.value}
                </span>
              )}
              {!trend.isPositive && !trend.isNegative && (
                <span className="flex items-center gap-0.5 text-gray-400 font-medium">
                  <Minus className="h-3.5 w-3.5" /> {trend.value}
                </span>
              )}
              {trend.label && <span className="text-gray-500 ml-1">{trend.label}</span>}
            </div>
          )}

          {description && !trend && <span className="text-gray-400 truncate">{description}</span>}
        </div>
      )}
    </Card>
  );
};
