import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Languages, User, LogOut, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useBlockchainAuth } from '@/contexts/BlockchainAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout: firebaseLogout } = useApp();
  const { logout: blockchainLogout } = useBlockchainAuth();
  const { isAuthenticated, currentUser, authType } = useUnifiedAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  const handleLogout = () => {
    if (authType === 'blockchain') {
      blockchainLogout();
    } else {
      firebaseLogout();
    }
  };

  const displayUser = authType === 'firebase' ? user : {
    firstName: currentUser?.address?.slice(0, 6) || 'User',
    lastName: ''
  };

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.howItWorks'), href: '/how-it-works' },
    { name: t('nav.insurance'), href: '/insurance' },
    { name: t('nav.donate'), href: '/donate' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  return (
    <nav className="bg-primary shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-highlight rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">
              TibaTrust
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative text-primary-foreground hover:text-highlight px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                      isActive ? 'text-highlight' : ''
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-highlight rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-primary-foreground hover:bg-secondary"
            >
              <Languages className="w-4 h-4 mr-2" />
              {language === 'en' ? 'SW' : 'EN'}
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard" className="flex items-center space-x-2 text-primary-foreground hover:text-highlight">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{displayUser.firstName}</span>
                  {authType === 'blockchain' && (
                    <span className="text-xs bg-blue-500 px-1 rounded">Web3</span>
                  )}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-primary-foreground hover:bg-secondary"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="btn-hero">
                    {t('nav.joinNow')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-foreground hover:text-highlight p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-secondary">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`relative text-secondary-foreground hover:text-highlight block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                    isActive ? 'text-highlight bg-accent/50' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-highlight rounded-r-full" />
                  )}
                </Link>
              );
            })}
            <div className="border-t border-accent pt-4 mt-4">
              <div className="flex flex-col space-y-2 px-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="text-secondary-foreground hover:bg-accent justify-start"
                >
                  <Languages className="w-4 h-4 mr-2" />
                  Switch to {language === 'en' ? 'Swahili' : 'English'}
                </Button>
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center space-x-2 px-3 py-2 text-secondary-foreground hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>{displayUser.firstName} {displayUser.lastName}</span>
                      {authType === 'blockchain' && (
                        <span className="text-xs bg-blue-500 px-1 rounded text-white">Web3</span>
                      )}
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('nav.logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        {t('nav.login')}
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="btn-hero w-full">
                        {t('nav.joinNow')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;