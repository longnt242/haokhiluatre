import { usePreset } from '../../contexts/PresetContext';
import HeroModern from './modern/HeroModern';
import HeroTrad from './trad/HeroTrad';
import HeroPremium from './premium/HeroPremium';

export default function PresetAwareHero() {
  const { preset } = usePreset();
  
  if (preset === 'trad') {
    return <HeroTrad />;
  }
  
  if (preset === 'premium') {
    return <HeroPremium />;
  }
  
  return <HeroModern />;
}