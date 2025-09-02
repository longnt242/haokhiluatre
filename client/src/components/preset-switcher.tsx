import { useState } from 'react';
import { Palette, Check, Copy, Share } from 'lucide-react';
import { useTheme, type ThemeType } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const themeLabels: Record<ThemeType, string> = {
  modern: 'Hiện đại',
  trad: 'Cổ truyền VN',
};

const themeMessages: Record<ThemeType, string> = {
  modern: 'Quay về giao diện Hiện đại',
  trad: 'Đã áp dụng giao diện Cổ truyền VN',
};

export default function PresetSwitcher() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    toast({
      title: themeMessages[newTheme],
      duration: 2000,
    });
    setIsOpen(false);
  };

  const copyThemeLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('theme', theme);
    
    try {
      await navigator.clipboard.writeText(url.toString());
      toast({
        title: 'Đã sao chép liên kết với giao diện hiện tại',
        duration: 2000,
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url.toString();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: 'Đã sao chép liên kết với giao diện hiện tại',
        duration: 2000,
      });
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
          data-testid="preset-switcher-trigger"
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Giao diện</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleThemeChange('modern')}
          className="flex items-center justify-between cursor-pointer"
          data-testid="theme-option-modern"
        >
          <span>{themeLabels.modern}</span>
          {theme === 'modern' && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange('trad')}
          className="flex items-center justify-between cursor-pointer"
          data-testid="theme-option-trad"
        >
          <span>{themeLabels.trad}</span>
          {theme === 'trad' && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={copyThemeLink}
          className="flex items-center gap-2 cursor-pointer"
          data-testid="copy-theme-link"
        >
          <Share className="w-4 h-4" />
          <span>Chia sẻ giao diện</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}