
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, ChevronLeft, Home, Menu, Search, Trophy, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMobile } from '@/hooks/use-mobile';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isMobile } = useMobile();

  // Mock authentication state - would be replaced with actual auth logic
  const isAuthenticated = false;
  const user = null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/feed') return 'Feed';
    if (path === '/scoreboard') return 'Scoreboard';
    if (path === '/predictions') return 'Predictions';
    if (path === '/profile') return 'Profile';
    if (path === '/auth') return 'Sign In';
    return 'Bleacher Banter';
  };

  // Check if we're on a nested page that should show a back button
  const showBackButton = () => {
    const path = location.pathname;
    return path !== '/' && path !== '/feed' && path !== '/scoreboard' && path !== '/predictions' && path !== '/profile';
  };

  // Mobile header
  if (isMobile) {
    return (
      <header 
        className={`mobile-header px-4 py-3 flex items-center ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        {showBackButton() ? (
          <Link to={location.pathname.split('/').slice(0, -1).join('/') || '/'} className="mr-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
        ) : (
          <h1 className="text-lg font-semibold flex-1">{getPageTitle()}</h1>
        )}
        
        {!showBackButton() && (
          <div className="flex-1 flex justify-end items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
                </Button>
                <Link to="/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="rounded-full text-xs h-8 px-3 shadow-sm btn-hover">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </header>
    );
  }

  // Desktop header
  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 animate-fade-in">
          <span className="font-bold text-xl text-primary">Bleacher Banter</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/feed"
            className={`font-medium transition-colors hover:text-primary ${
              location.pathname === '/feed' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            Feed
          </Link>
          <Link
            to="/scoreboard"
            className={`font-medium transition-colors hover:text-primary ${
              location.pathname === '/scoreboard' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            Scoreboard
          </Link>
          <Link
            to="/predictions"
            className={`font-medium transition-colors hover:text-primary ${
              location.pathname === '/predictions' ? 'text-primary' : 'text-foreground/80'
            }`}
          >
            Predictions
          </Link>
        </nav>

        {/* Auth / User Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full"></span>
              </Button>
              <Link to="/profile">
                <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="outline" className="shadow-sm btn-hover">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu - Now using Sheet from shadcn */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <nav className="flex flex-col space-y-4 mt-6">
                <Link
                  to="/feed"
                  className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
                    location.pathname === '/feed' ? 'bg-secondary text-primary' : 'text-foreground/80'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span>Feed</span>
                </Link>
                <Link
                  to="/scoreboard"
                  className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
                    location.pathname === '/scoreboard' ? 'bg-secondary text-primary' : 'text-foreground/80'
                  }`}
                >
                  <Trophy className="h-5 w-5" />
                  <span>Scoreboard</span>
                </Link>
                <Link
                  to="/predictions"
                  className={`flex items-center space-x-2 py-2 px-3 rounded-md ${
                    location.pathname === '/predictions' ? 'bg-secondary text-primary' : 'text-foreground/80'
                  }`}
                >
                  <Search className="h-5 w-5" />
                  <span>Predictions</span>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
