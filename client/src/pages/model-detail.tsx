import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, Box, Download } from 'lucide-react';
import ModelViewer from '@/components/model-viewer';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ModelFile {
  name: string;
  url: string;
  created_at: string;
  metadata?: {
    size: number;
  };
}

export default function ModelDetail() {
  const [match, params] = useRoute('/models/:modelName');
  const modelName = params?.modelName ? decodeURIComponent(params.modelName) : '';

  const { data: models, isLoading, error } = useQuery<ModelFile[]>({
    queryKey: ['/api/content/models'],
  });

  const model = models?.find(m => m.name === modelName);

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="aspect-video rounded-lg mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Box className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy mô hình</h2>
            <p className="text-muted-foreground mb-4">Mô hình bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link href="/models">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
                Quay lại danh sách mô hình
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = model.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, "");
  const isGLB = model.name.toLowerCase().endsWith('.glb');

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/models">
            <button 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
              data-testid="button-back-to-models"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách mô hình
            </button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4" data-testid="model-detail-title">
            {displayName}
          </h1>
          <p className="text-xl text-muted-foreground">
            Mô hình 3D chi tiết cho game Hào Khí Lửa Tre
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-0">
            <ModelViewer
              src={model.url}
              alt={displayName}
              className="aspect-video w-full"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-lg mb-4">Mô Tả</h4>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Mô hình 3D chất lượng cao được thiết kế đặc biệt cho game "Hào Khí Lửa Tre". 
              Được tạo bằng các công cụ chuyên nghiệp và tối ưu hóa cho Unreal Engine 5 
              với hệ thống Nanite virtualization technology.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Mô hình này thể hiện tinh thần văn hóa Việt Nam qua từng chi tiết, từ kiến trúc 
              truyền thống đến các yếu tố võ thuật cổ đại. Được render với chất lượng 
              cinematic và hỗ trợ đầy đủ các tính năng PBR (Physically Based Rendering).
            </p>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Thông Tin Chi Tiết</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Định dạng:</span>
                    <span className="font-medium">{isGLB ? 'GLB' : 'GLTF'}</span>
                  </div>
                  {model.metadata?.size && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kích thước:</span>
                      <span className="font-medium">
                        {(model.metadata.size / (1024 * 1024)).toFixed(1)}MB
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngày tải lên:</span>
                    <span className="font-medium">
                      {new Date(model.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WebGL:</span>
                    <span className="font-medium text-green-500">Hỗ trợ</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <a
                    href={model.url}
                    download={model.name}
                    className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    data-testid="button-download-model"
                  >
                    <Download className="w-4 h-4" />
                    Tải xuống mô hình
                  </a>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                  {isGLB ? 'GLB Format' : 'GLTF Format'}
                </span>
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                  High Quality
                </span>
                <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm">
                  UE5 Ready
                </span>
                <span className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                  PBR Textured
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
