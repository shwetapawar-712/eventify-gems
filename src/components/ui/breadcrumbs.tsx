import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];
    
    // Add home
    items.push({ label: 'Home', path: '/' });
    
    // Build breadcrumb items from path
    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      
      // Convert path segments to readable labels
      let label = name.charAt(0).toUpperCase() + name.slice(1);
      if (name === 'organizer') label = 'Organizer Dashboard';
      if (name === 'participant') label = 'Participant Dashboard';
      if (name === 'create') label = 'Create Event';
      if (name === 'events') label = 'My Events';
      if (name === 'attendance') label = 'Attendance';
      if (name === 'badges') label = 'Badges';
      
      items.push({ label, path: currentPath });
    });

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={item.path} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          
          {index === 0 ? (
            <Link 
              to={item.path} 
              className="flex items-center hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              {item.label}
            </Link>
          ) : index === breadcrumbItems.length - 1 ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link 
              to={item.path} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};