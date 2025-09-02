import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  isVisible?: boolean;
}

export default function PageTransition({ children, isVisible = true }: PageTransitionProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsLoaded(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(false);
    }
  }, [isVisible]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isLoaded 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95'
      }`}
    >
      {children}
    </div>
  );
}

// Scroll reveal hook
export function useScrollReveal(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(elementRef);

    return () => {
      if (elementRef) {
        observer.unobserve(elementRef);
      }
    };
  }, [elementRef, threshold]);

  return [setElementRef, isVisible] as const;
}