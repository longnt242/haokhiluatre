import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Upload } from 'lucide-react';
import gameIcon from '../assets/game-icon.png';
import PresetSwitcher from './preset-switcher';

export default function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src={gameIcon} alt="Game Icon" className="w-8 h-8 mr-3" />
              <div>
                <h1 className="font-display text-xl font-bold golden-text">Hào Khí Lửa Tre</h1>
                <span className="ml-2 text-sm text-muted-foreground">— The Weakened Team</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex space-x-6 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    isActive(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/upload"
                className="text-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
                data-testid="nav-link-upload"
              >
                <Upload className="w-4 h-4" />
                Tải lên
              </Link>
              <PresetSwitcher />
            </div>
          </div>
          
          <button
            className="md:hidden text-foreground hover:text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="px-4 py-2 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 transition-colors ${
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/upload"
              className="block py-2 text-accent hover:text-accent-foreground transition-colors flex items-center gap-2"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="mobile-nav-link-upload"
            >
              <Upload className="w-4 h-4" />
              Tải lên
            </Link>
            <div className="py-2">
              <PresetSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
