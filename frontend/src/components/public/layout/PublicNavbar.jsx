import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Search, Menu, X } from 'lucide-react';
import { navigation, siteInfo } from '../../../data/publicSiteData';

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-white/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-pub-blue-600 flex items-center justify-center text-white group-hover:bg-pub-blue-700 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="font-semibold text-gray-800 text-lg hidden sm:block">
              {siteInfo.shortName}
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:border-pub-blue-500 focus:ring-1 focus:ring-pub-blue-500 outline-none text-sm transition-colors"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-pub-blue-600 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <li key={item.path}>
                {item.isButton ? (
                  <Link
                    to={item.path}
                    className="ml-2 px-4 py-2 bg-pub-accent-600 text-white rounded-lg font-medium hover:bg-pub-accent-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-pub-blue-700 bg-pub-blue-50'
                        : 'text-gray-600 hover:text-pub-blue-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-200 focus:border-pub-blue-500 focus:ring-1 focus:ring-pub-blue-500 outline-none text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.path}>
                  {item.isButton ? (
                    <Link
                      to={item.path}
                      className="block px-4 py-3 bg-pub-accent-600 text-white rounded-lg font-medium text-center mt-2"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-pub-blue-700 bg-pub-blue-50'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
