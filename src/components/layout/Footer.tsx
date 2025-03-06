
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Bleacher Banter</h3>
            <p className="text-muted-foreground">
              The social platform for high school sports fans and athletes.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/feed" className="text-muted-foreground hover:text-primary transition-colors">
                  Feed
                </Link>
              </li>
              <li>
                <Link to="/scoreboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Scoreboard
                </Link>
              </li>
              <li>
                <Link to="/predictions" className="text-muted-foreground hover:text-primary transition-colors">
                  Predictions
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-muted-foreground hover:text-primary transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 text-center text-muted-foreground text-sm">
          <p>© {currentYear} Bleacher Banter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
