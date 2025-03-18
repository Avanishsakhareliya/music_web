
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Music, 
  Search, 
  ListMusic, 
  LogOut, 
  LogIn, 
  UserPlus,
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const NavLink = ({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
          isActive 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        onClick={closeMenu}
      >
        {icon}
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 ${
        isScrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Music className="w-8 h-8 text-primary" />
          <span className="text-xl font-semibold">Melodify</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" icon={<ListMusic className="w-4 h-4" />}>
                My Playlists
              </NavLink>
              <NavLink to="/search" icon={<Search className="w-4 h-4" />}>
                Discover
              </NavLink>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login" icon={<LogIn className="w-4 h-4" />}>
                Login
              </NavLink>
              <NavLink to="/register" icon={<UserPlus className="w-4 h-4" />}>
                Register
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass shadow-md py-4 animate-slide-down">
          <nav className="container-custom flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" icon={<ListMusic className="w-4 h-4" />}>
                  My Playlists
                </NavLink>
                <NavLink to="/search" icon={<Search className="w-4 h-4" />}>
                  Discover
                </NavLink>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    logout();
                    closeMenu();
                  }} 
                  className="flex items-center gap-2 justify-start"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" icon={<LogIn className="w-4 h-4" />}>
                  Login
                </NavLink>
                <NavLink to="/register" icon={<UserPlus className="w-4 h-4" />}>
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
