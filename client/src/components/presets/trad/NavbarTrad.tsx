import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Upload, Home, Box, Image, Video, Info } from 'lucide-react';
import gameIcon from '../../../assets/game-icon.png';
import PresetSwitcher from '../PresetSwitcher';

export default function NavbarTrad() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/models', label: 'Mô hình 3D', icon: Box },
    { href: '/gallery', label: 'Thư viện ảnh', icon: Image },
    { href: '/videos', label: 'Video', icon: Video },
    { href: '/about', label: 'Giới thiệu', icon: Info },
  ];

  const isActive = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border z-50 hidden md:flex flex-col"
        style={{ 
          background: 'var(--surface)',
          backdropFilter: 'var(--backdrop-blur)',
        }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex flex-col items-center">
            <img src={gameIcon} alt="Game Icon" className="w-12 h-12 mb-3" />
            <div className="text-center">
              <h1 className="font-display text-lg font-bold text-accent mb-1" style={{ fontFamily: 'var(--font-family-display)' }}>
                Hào Khí Lửa Tre
              </h1>
              <span className="text-sm text-muted-foreground">— The Weakened Team</span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-accent text-accent-contrast font-medium'
                        : 'text-text-muted hover:bg-surface hover:text-accent'
                    }`}
                    data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span style={{ fontFamily: 'var(--font-family-body)' }}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            
            {/* Upload Link */}
            <li>
              <Link
                href="/upload"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary hover:bg-surface hover:text-accent transition-all duration-200"
                data-testid="nav-link-upload"
              >
                <Upload className="w-5 h-5" />
                <span style={{ fontFamily: 'var(--font-family-body)' }}>Tải lên</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-border">
          <PresetSwitcher />
          <div className="mt-4 text-center">
            <div className="w-full h-px bg-accent opacity-30 mb-3"></div>
            <p className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-family-body)' }}>
              Made in Vietnam 🇻🇳
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <nav className="md:hidden sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="flex justify-between items-center px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <img src={gameIcon} alt="Game Icon" className="w-8 h-8" />
            <h1 className="font-display text-lg font-bold text-accent" style={{ fontFamily: 'var(--font-family-display)' }}>
              Hào Khí Lửa Tre
            </h1>
          </Link>
          
          <button
            className="text-text hover:text-accent p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-surface border-t border-border">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                      isActive(item.href)
                        ? 'text-accent bg-accent/10'
                        : 'text-text-muted hover:text-accent'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span style={{ fontFamily: 'var(--font-family-body)' }}>{item.label}</span>
                  </Link>
                );
              })}
              <Link
                href="/upload"
                className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:text-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-link-upload"
              >
                <Upload className="w-4 h-4" />
                <span style={{ fontFamily: 'var(--font-family-body)' }}>Tải lên</span>
              </Link>
              <div className="px-3 py-2">
                <PresetSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}