import { useState } from 'react';
import { Palette, Check, Share } from 'lucide-react';
import { usePreset, type PresetType } from '../../contexts/PresetContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const presetLabels: Record<PresetType, string> = {
  modern: 'Hiện đại',
  trad: 'Cổ truyền VN',
  premium: 'Premium',
};

const presetMessages: Record<PresetType, string> = {
  modern: 'Đã quay về giao diện Hiện đại',
  trad: 'Đã áp dụng giao diện Cổ truyền VN',
  premium: 'Đã áp dụng giao diện Premium',
};

export default function PresetSwitcher() {
  const { preset, setPreset } = usePreset();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetChange = (newPreset: PresetType) => {
    setPreset(newPreset);
    toast({
      title: presetMessages[newPreset],
      duration: 2000,
    });
    setIsOpen(false);
  };

  const copyPresetLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('preset', preset);
    
    try {
      await navigator.clipboard.writeText(url.toString());
      toast({
        title: 'Đã sao chép link giao diện này',
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
        title: 'Đã sao chép link giao diện này',
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
          onClick={() => handlePresetChange('modern')}
          className="flex items-center justify-between cursor-pointer"
          data-testid="preset-option-modern"
        >
          <span>{presetLabels.modern}</span>
          {preset === 'modern' && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handlePresetChange('trad')}
          className="flex items-center justify-between cursor-pointer"
          data-testid="preset-option-trad"
        >
          <span>{presetLabels.trad}</span>
          {preset === 'trad' && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handlePresetChange('premium')}
          className="flex items-center justify-between cursor-pointer"
          data-testid="preset-option-premium"
        >
          <span>{presetLabels.premium}</span>
          {preset === 'premium' && <Check className="w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={copyPresetLink}
          className="flex items-center gap-2 cursor-pointer"
          data-testid="copy-preset-link"
        >
          <Share className="w-4 h-4" />
          <span>Sao chép link giao diện này</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}