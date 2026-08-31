import React from 'react';
import { Badge } from './badge';

export type StatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'paid'
  | 'overdue'
  | 'failed'
  | 'submitted'
  | 'graded'
  | 'draft'
  | string;

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className }) => {
  const normalized = String(status).toLowerCase();

  const getVariant = (): 'success' | 'warning' | 'error' | 'info' | 'purple' => {
    switch (normalized) {
      case 'active':
      case 'approved':
      case 'paid':
      case 'graded':
      case 'present':
      case 'completed':
        return 'success';
      case 'pending':
      case 'submitted':
      case 'late':
      case 'partially_paid':
      case 'review':
        return 'warning';
      case 'inactive':
      case 'rejected':
      case 'overdue':
      case 'failed':
      case 'absent':
      case 'cancelled':
        return 'error';
      case 'draft':
      case 'excused':
      case 'enrolled':
        return 'info';
      default:
        return 'purple';
    }
  };

  const displayText = label || status.replace(/_/g, ' ');

  return (
    <Badge variant={getVariant()} className={`capitalize ${className || ''}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {displayText}
    </Badge>
  );
};
