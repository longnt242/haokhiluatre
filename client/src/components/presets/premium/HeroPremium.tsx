import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Play, Box, ArrowRight, Sparkles } from 'lucide-react';
import backgroundVideo from '../../../assets/background-video.mp4';

export default function HeroPremium() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Trigger loaded animation
    setTimeout(() => setIsLoaded(true), 100);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Dynamic Background with Parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              rgba(139, 69, 255, 0.15) 0%, 
              rgba(59, 130, 246, 0.1) 25%, 
              rgba(0, 0, 0, 0.8) 50%
            )
          `,
        }}
      />
      
      {/* Animated Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        className="absolute inset-0 w-full h-full object-cover opacity-20 scale-105 transition-transform duration-1000 ease-out"
        data-testid="hero-video-premium"
        style={{
          transform: `scale(1.05) translate(${mousePosition.x * 0.02 - 1}%, ${mousePosition.y * 0.02 - 1}%)`,
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        {/* Title with Animated Entry */}
        <div className="space-y-8">
          <h1 
            className={`font-bold text-5xl md:text-7xl lg:text-8xl leading-tight transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ 
              fontFamily: 'var(--font-family-display)',
              background: 'linear-gradient(135deg, #8b45ff 0%, #3b82f6 25%, #06b6d4 50%, #8b45ff 75%, #3b82f6 100%)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              animation: 'gradient-shift 8s ease infinite',
              letterSpacing: 'var(--letter-spacing)',
              textShadow: '0 0 40px rgba(139, 69, 255, 0.3)',
            }}
          >
            Hào Khí Lửa Tre
          </h1>
          
          {/* Subtitle with Delay */}
          <p 
            className={`text-xl md:text-3xl lg:text-4xl font-medium leading-relaxed transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              fontFamily: 'var(--font-family-body)',
              color: 'var(--text-muted)',
              transitionDelay: '200ms',
            }}
          >
            Cinematic UE5 — dự án indie bởi The Weakened Team
          </p>
          
          {/* Description with Glass Card */}
          <div 
            className={`max-w-3xl mx-auto p-8 rounded-3xl transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--backdrop-blur)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-elev-1)',
              transitionDelay: '400ms',
            }}
          >
            <p 
              className="text-lg md:text-xl leading-relaxed"
              style={{ 
                fontFamily: 'var(--font-family-body)',
                color: 'var(--text)',
                lineHeight: '1.8',
              }}
            >
              Khám phá thế giới võ thuật cổ đại với công nghệ đồ họa hiện đại. 
              Trải nghiệm câu chuyện đầy cảm xúc về danh dự và lửa tre bất diệt.
            </p>
          </div>
          
          {/* Action Buttons with Premium Effects */}
          <div 
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <Link href="/videos">
              <button 
                className="group relative px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 flex items-center gap-4 overflow-hidden"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-contrast)',
                  fontFamily: 'var(--font-family-body)',
                  boxShadow: 'var(--shadow-elev-2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                data-testid="button-watch-teaser"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-elev-3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-elev-2)';
                }}
              >
                <Play className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-125" />
                <span className="relative z-10">Xem Teaser</span>
                <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </button>
            </Link>
            
            <Link href="/models">
              <button 
                className="group relative px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-500 border-2 flex items-center gap-4 overflow-hidden"
                style={{
                  background: 'transparent',
                  color: 'var(--text)',
                  borderColor: 'var(--glass-border)',
                  fontFamily: 'var(--font-family-body)',
                  backdropFilter: 'var(--backdrop-blur)',
                }}
                data-testid="button-explore-models"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--glass-bg)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.transform = 'scale(1) translateY(0)';
                }}
              >
                <Box className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative z-10">Khám phá Mô Hình 3D</span>
                <Sparkles className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:rotate-180" />
                
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: '0 0 30px rgba(139, 69, 255, 0.3)' }}></div>
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-60 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '800ms' }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span 
            className="text-sm font-medium"
            style={{ 
              fontFamily: 'var(--font-family-body)',
              color: 'var(--text-muted)',
            }}
          >
            Cuộn xuống để khám phá
          </span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
      
      {/* Custom Gradient Animation */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  );
}