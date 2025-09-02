import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Play, Volume2, VolumeX, Clock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ContentActionsMenu from '@/components/content-actions-menu';
import { Link } from 'wouter';

interface VideoFile {
  name: string;
  url: string;
  created_at: string;
  metadata?: {
    size: number;
  };
}
const API_URL = import.meta.env.VITE_API_URL;

export default function Videos() {
  const { data: videos, isLoading, error } = useQuery<VideoFile[]>({
    queryKey: [`${API_URL}/api/content/videos`],
  });

  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});

  const toggleMute = (videoName: string, videoRef: HTMLVideoElement) => {
    const newMutedState = !mutedStates[videoName];
    setMutedStates(prev => ({
      ...prev,
      [videoName]: newMutedState
    }));
    videoRef.muted = newMutedState;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-card py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Video</h2>
            <p className="text-destructive">Không thể tải danh sách video. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Video</h2>
          <p className="text-xl text-muted-foreground">Teaser và trailer gameplay chính thức</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 mb-2" />
                  <Skeleton className="h-4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !videos || videos.length === 0 ? (
          <div className="text-center py-20">
            <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Chưa có video</h3>
            <p className="text-muted-foreground mb-4">Hiện tại chưa có video nào được tải lên.</p>
            <Link href="/upload">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
                Tải lên video đầu tiên
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {videos.map((video, index) => {
              const videoName = video.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, "");
              const isMuted = mutedStates[video.name] !== false; // Default to muted
              
              return (
                <Card key={video.name} className="overflow-hidden bg-background border border-border">
                  <div className="relative aspect-video">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      muted={isMuted}
                      preload="metadata"
                      data-testid={`video-${index}`}
                      ref={(el) => {
                        if (el) {
                          el.muted = isMuted;
                        }
                      }}
                    >
                      <source src={video.url} type="video/mp4" />
                      <source src={video.url} type="video/webm" />
                      Trình duyệt của bạn không hỗ trợ thẻ video.
                    </video>
                    <ContentActionsMenu
                      fileName={video.name}
                      bucket="videos"
                      currentTitle={videoName}
                      currentDescription="Video từ dự án game Hào Khí Lửa Tre - Thể hiện tinh thần võ thuật cổ đại Việt Nam"
                    />
                    <div className="absolute bottom-4 right-4">
                      <button
                        className="bg-black/50 text-white p-2 rounded hover:bg-black/70 transition-colors"
                        onClick={(e) => {
                          const videoEl = e.currentTarget.closest('.relative')?.querySelector('video') as HTMLVideoElement;
                          if (videoEl) {
                            toggleMute(video.name, videoEl);
                          }
                        }}
                        data-testid={`button-toggle-mute-${index}`}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl mb-2" data-testid={`video-title-${index}`}>
                      {videoName}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Video từ dự án game Hào Khí Lửa Tre - Thể hiện tinh thần võ thuật cổ đại Việt Nam
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {video.metadata?.size ? `${(video.metadata.size / (1024 * 1024)).toFixed(1)}MB` : 'N/A'}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {new Date(video.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
