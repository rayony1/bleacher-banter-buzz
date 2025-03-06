
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, ListFilter, User } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

const BottomNav = () => {
  const location = useLocation();
  const { isMobile } = useMobile();
  
  // Don't render if not mobile
  if (!isMobile) return null;
  
  const navItems = [
    { path: '/feed', label: 'Feed', icon: Home },
    { path: '/scoreboard', label: 'Scores', icon: Trophy },
    { path: '/predictions', label: 'Predict', icon: ListFilter },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 h-16 z-40">
      <div className="grid grid-cols-4 h-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
