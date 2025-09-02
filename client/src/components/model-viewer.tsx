import { useEffect, useRef } from 'react';
import { Expand, RotateCcw, Home, Box } from 'lucide-react';

// Declare global JSX element for model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ModelViewerProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ModelViewer({ src, alt, className = '' }: ModelViewerProps) {
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Dynamically import model-viewer to avoid SSR issues and prevent duplicate registration
    const loadModelViewer = async () => {
      if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
        await import('@google/model-viewer');
      }
    };
    loadModelViewer();
  }, []);

  const handleReset = () => {
    const viewer = viewerRef.current as any;
    if (viewer && viewer.resetTurntableRotation) {
      viewer.resetTurntableRotation();
      viewer.jumpCameraToGoal();
    }
  };

  const handleFullscreen = () => {
    const viewer = viewerRef.current as any;
    if (viewer && viewer.requestFullscreen) {
      viewer.requestFullscreen();
    }
  };

  const toggleAutoRotate = () => {
    const viewer = viewerRef.current as any;
    if (viewer) {
      const isRotating = viewer.hasAttribute('auto-rotate');
      if (isRotating) {
        viewer.removeAttribute('auto-rotate');
      } else {
        viewer.setAttribute('auto-rotate', '');
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <model-viewer
        ref={viewerRef}
        src={src}
        alt={alt}
        camera-controls
        touch-action="pan-y"
        disable-pan
        auto-rotate
        auto-rotate-delay="3000"
        rotation-per-second="20deg"
        field-of-view="30deg"
        min-camera-orbit="auto auto 1m"
        max-camera-orbit="auto auto 10m"
        camera-orbit="45deg 75deg 4m"
        environment-image="https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.hdr"
        skybox-image="https://modelviewer.dev/shared-assets/environments/spruit_sunrise_1k_HDR.hdr"
        exposure="1.2"
        shadow-intensity="0.7"
        shadow-softness="0.8"
        tone-mapping="aces"
        className="w-full h-full bg-gradient-to-b from-sky-100 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg"
        data-testid="model-viewer"
      >
        <div slot="progress-bar" className="absolute bottom-2 left-2 right-2">
          <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300"></div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg" slot="poster">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
              <Box className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">Nhấn để tải mô hình 3D</p>
            <p className="text-xs text-muted-foreground/70 mt-2">Kéo để xoay • Lăn chuột để zoom</p>
          </div>
        </div>
      </model-viewer>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between">
        <div className="flex gap-2">
          <button
            onClick={toggleAutoRotate}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded transition-colors backdrop-blur-sm"
            title="Bật/tắt xoay tự động"
            data-testid="button-auto-rotate"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded transition-colors backdrop-blur-sm"
            title="Đặt lại góc nhìn"
            data-testid="button-reset-camera"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleFullscreen}
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded transition-colors backdrop-blur-sm"
          title="Xem toàn màn hình"
          data-testid="button-fullscreen"
        >
          <Expand className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
