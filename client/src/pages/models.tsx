import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Box, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ContentActionsMenu from '@/components/content-actions-menu';

interface ModelFile {
  name: string;
  url: string;
  created_at: string;
  metadata?: {
    size: number;
  };
}

export default function Models() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { data: models, isLoading, error } = useQuery<ModelFile[]>({
    queryKey: [`${API_URL}/api/content/models`],
  });

  if (error) {
    return (
      <div className="min-h-screen bg-card py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Mô Hình 3D</h2>
            <p className="text-destructive">Không thể tải danh sách mô hình. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Mô Hình 3D</h2>
          <p className="text-xl text-muted-foreground">Khám phá các nhân vật và đạo cụ được tạo bằng Unreal Engine 5</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 mb-2" />
                  <Skeleton className="h-4 mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !models || models.length === 0 ? (
          <div className="text-center py-20">
            <Box className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Chưa có mô hình 3D</h3>
            <p className="text-muted-foreground mb-4">Hiện tại chưa có mô hình nào được tải lên.</p>
            <Link href="/upload">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
                Tải lên mô hình đầu tiên
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {models.map((model, index) => (
              <Card key={model.name} className="overflow-hidden hover:border-primary/50 transition-all group relative">
                <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
                  <Link href={`/models/${encodeURIComponent(model.name)}`} className="absolute inset-0 z-10">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Box className="w-16 h-16 text-primary" />
                    </div>
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="flex items-center gap-2 text-white">
                      <Box className="w-4 h-4" />
                      <span className="text-sm">
                        {model.name.toLowerCase().endsWith('.glb') ? 'GLB Model' : 'GLTF Model'}
                      </span>
                    </div>
                  </div>
                  <ContentActionsMenu
                    fileName={model.name}
                    bucket="models"
                    currentTitle={model.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, "")}
                    currentDescription="Mô hình 3D chất lượng cao cho game Hào Khí Lửa Tre"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2" data-testid={`model-title-${index}`}>
                    {model.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, "")}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    Mô hình 3D cho game Hào Khí Lửa Tre
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                      {model.name.toLowerCase().endsWith('.glb') ? 'GLB' : 'GLTF'}
                    </span>
                    {model.metadata?.size && (
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                        {(model.metadata.size / (1024 * 1024)).toFixed(1)}MB
                      </span>
                    )}
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Xem chi tiết
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
