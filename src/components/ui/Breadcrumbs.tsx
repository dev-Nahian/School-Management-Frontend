import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const location = useLocation();

  // Generate breadcrumb items automatically if not explicitly provided
  const generateItems = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbList: BreadcrumbItem[] = [{ label: 'Dashboard', href: '/dashboard' }];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const formattedLabel = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      breadcrumbList.push({
        label: formattedLabel,
        href: currentPath,
      });
    });

    return breadcrumbList;
  };

  const list = items || generateItems();

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-gray-400 mb-4 font-mono">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-purple-300 transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {list.map((item, index) => {
        const isLast = index === list.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 text-gray-600 shrink-0" />
            {isLast || !item.href ? (
              <span className="font-semibold text-purple-300 truncate max-w-[150px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-white transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
