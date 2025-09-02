import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Upload, Sparkles } from 'lucide-react';
import gameIcon from '../../../assets/game-icon.png';
import PresetSwitcher from '../PresetSwitcher';

export default function NavbarPremium() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Trang chủ' },
    { href: '/models', label: 'Mô hình 3D' },
    { href: '/gallery', label: 'Thư viện ảnh' },
    { href: '/videos', label: 'Video' },
    { href: '/about', label: 'Giới thiệu' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Floating Glass Navbar */}
      <nav 
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
          scrolled ? 'top-2' : 'top-6'
        }`}
        style={{
          backdropFilter: 'var(--backdrop-blur)',
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-large)',
          boxShadow: 'var(--shadow-elev-2)',
        }}
      >
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <img 
                  src={gameIcon} 
                  alt="Game Icon" 
                  className="w-8 h-8 mr-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" 
                />
                <div className="absolute inset-0 animate-glow rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 
                  className="font-bold text-lg transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text"
                  style={{ 
                    fontFamily: 'var(--font-family-display)',
                    background: 'var(--primary)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Hào Khí Lửa Tre
                </h1>
                <span 
                  className="text-sm transition-colors duration-300"
                  style={{ color: 'var(--text-muted)' }}
                >
                  — The Weakened Team
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'hover:text-white'
                  }`}
                  style={{ 
                    fontFamily: 'var(--font-family-body)',
                    color: isActive(item.href) ? 'var(--text)' : 'var(--text-muted)',
                  }}
                  data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {isActive(item.href) && (
                    <div 
                      className="absolute inset-0 rounded-lg opacity-20"
                      style={{
                        background: 'var(--primary)',
                      }}
                    />
                  )}
                  <div 
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                    style={{
                      background: 'var(--accent)',
                    }}
                  />
                </Link>
              ))}
              
              {/* Upload Button */}
              <Link href="/upload">
                <button 
                  className="relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center gap-2 group overflow-hidden"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--accent-contrast)',
                    fontFamily: 'var(--font-family-body)',
                    boxShadow: 'var(--shadow-elev-2)',
                  }}
                  data-testid="nav-link-upload"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-elev-3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-elev-2)';
                  }}
                >
                  <Upload className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="relative z-10">Tải lên</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </button>
              </Link>
              
              <PresetSwitcher />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg transition-all duration-300 hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
              style={{ color: 'var(--text)' }}
            >
              <div className="relative w-5 h-5">
                <Menu className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`absolute inset-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className="absolute top-20 left-4 right-4 p-6 rounded-2xl transition-all duration-300 transform"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--backdrop-blur)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-elev-3)',
            }}
          >
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ 
                    fontFamily: 'var(--font-family-body)',
                    color: isActive(item.href) ? 'var(--text)' : 'var(--text-muted)',
                  }}
                  data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/upload"
                className="block px-4 py-3 rounded-xl text-center font-medium transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--accent-contrast)',
                  fontFamily: 'var(--font-family-body)',
                }}
                data-testid="mobile-nav-link-upload"
              >
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Tải lên
                </div>
              </Link>
              <div className="pt-4 border-t border-white/10">
                <PresetSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Spacer to prevent content overlap */}
      <div className="h-20"></div>
    </>
  );
}