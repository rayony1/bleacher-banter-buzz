
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, ListFilter, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/feed', label: 'Feed', icon: Home },
    { path: '/scoreboard', label: 'Scores', icon: Trophy },
    { path: '/predictions', label: 'Predict', icon: ListFilter },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default BottomNav;
