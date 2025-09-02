import { Link } from 'wouter';
import { Play, Box } from 'lucide-react';
import backgroundVideo from '../../../assets/background-video.mp4';

export default function HeroTrad() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Traditional hero background with texture */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(135deg, rgba(178, 10, 10, 0.2) 0%, rgba(242, 200, 75, 0.1) 100%)',
        }}
      ></div>
      
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-4 md:px-8 py-12">
        {/* Left Column - Text Content */}
        <div className="lg:pr-8">
          <div className="max-w-2xl">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ 
                fontFamily: 'var(--font-family-display)', 
                color: 'var(--accent)',
                textShadow: '0 0 20px rgba(242, 200, 75, 0.3)',
                letterSpacing: 'var(--letter-spacing)',
              }}
            >
              Hào Khí Lửa Tre
            </h1>
            
            <div 
              className="w-24 h-1 mb-6"
              style={{ background: 'linear-gradient(to right, var(--accent), transparent)' }}
            ></div>
            
            <p 
              className="text-xl md:text-2xl mb-6 leading-relaxed"
              style={{ 
                fontFamily: 'var(--font-family-display)', 
                color: 'var(--text-muted)',
              }}
            >
              Cinematic UE5 — dự án indie bởi The Weakened Team
            </p>
            
            <p 
              className="text-lg mb-8 max-w-xl leading-relaxed"
              style={{ 
                fontFamily: 'var(--font-family-body)', 
                color: 'var(--text)',
                lineHeight: '1.7',
              }}
            >
              Khám phá thế giới võ thuật cổ đại với công nghệ đồ họa hiện đại. 
              Trải nghiệm câu chuyện đầy cảm xúc về danh dự và lửa tre bất diệt.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/videos">
                <button 
                  className="group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 relative overflow-hidden"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--primary-contrast)',
                    fontFamily: 'var(--font-family-body)',
                    boxShadow: 'var(--shadow-elev-2)',
                  }}
                  data-testid="button-watch-teaser"
                >
                  <Play className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Xem Teaser</span>
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                  ></div>
                </button>
              </Link>
              
              <Link href="/models">
                <button 
                  className="group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 border-2 flex items-center gap-3 relative overflow-hidden"
                  style={{
                    background: 'transparent',
                    color: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    fontFamily: 'var(--font-family-body)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent-contrast)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  data-testid="button-explore-models"
                >
                  <Box className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Khám phá Mô Hình 3D</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Column - Video in Bamboo Frame */}
        <div className="lg:pl-8 flex justify-center">
          <div className="relative max-w-lg w-full">
            {/* Bamboo Frame Container */}
            <div 
              className="relative p-6 rounded-lg"
              style={{
                background: 'var(--surface)',
                backdropFilter: 'var(--backdrop-blur)',
                border: '2px solid var(--border)',
              }}
            >
              {/* Bamboo Frame SVG Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  backgroundImage: 'url(/themes/trad/bamboo-frame.svg)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.8,
                }}
              ></div>
              
              {/* Video Container */}
              <div className="relative aspect-video rounded overflow-hidden">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover"
                  data-testid="hero-video-trad"
                >
                  <source src={backgroundVideo} type="video/mp4" />
                </video>
                
                {/* Video Overlay for Traditional Effect */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(45deg, rgba(178, 10, 10, 0.1), rgba(242, 200, 75, 0.1))',
                  }}
                ></div>
              </div>
              
              {/* Decorative Corner Elements */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 rounded-tl-lg" style={{ borderColor: 'var(--accent)' }}></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 rounded-tr-lg" style={{ borderColor: 'var(--accent)' }}></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 rounded-bl-lg" style={{ borderColor: 'var(--accent)' }}></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 rounded-br-lg" style={{ borderColor: 'var(--accent)' }}></div>
            </div>
            
            {/* Traditional Decorative Caption */}
            <div className="text-center mt-4">
              <p 
                className="text-sm italic"
                style={{ 
                  fontFamily: 'var(--font-family-display)', 
                  color: 'var(--text-muted)',
                }}
              >
                "Hào khí ngàn thu, lửa tre bất diệt"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}