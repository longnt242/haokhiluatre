import { usePreset } from '../../contexts/PresetContext';
import NavbarModern from './modern/NavbarModern';
import NavbarTrad from './trad/NavbarTrad';
import NavbarPremium from './premium/NavbarPremium';

export default function PresetAwareNavbar() {
  const { preset } = usePreset();
  
  if (preset === 'trad') {
    return <NavbarTrad />;
  }
  
  if (preset === 'premium') {
    return <NavbarPremium />;
  }
  
  return <NavbarModern />;
}