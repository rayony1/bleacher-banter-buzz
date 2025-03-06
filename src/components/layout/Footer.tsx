
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center text-muted-foreground text-sm">
          <p>© {currentYear} Bleacher Banter</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
