// upload.tsx  — phiên bản dùng Signed URL (Vercel Serverless + Supabase Storage)
// Thay toàn bộ nội dung file cũ bằng file này.

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Image, Video, Box, File as FileIcon } from 'lucide-react';

import { createClient } from '@supabase/supabase-js';

// Client Supabase: đọc từ Vite env, fallback sang window.env nếu có
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (window as any)?.env?.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (window as any)?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = supabaseUrl && supabaseKey;
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;
console.log(supabase)

type ContentType = 'image' | 'video' | 'model';

interface UploadResponse {
  ok: boolean;
  kind: ContentType;
  message?: string;
}
const API_URL = import.meta.env.VITE_API_URL;

// Hàm upload mới: xin signed URL từ /api/signed-upload, PUT trực tiếp lên Supabase
async function uploadViaSignedURL(file: File, bucket: string, folder?: string, password?: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('kind', bucket === 'images' ? 'image' : bucket === 'videos' ? 'video' : 'model');
  formData.append('title', folder || '');
  formData.append('password', password || '');

  const r = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    body: formData
  });
}

export default function Upload() {
  const [contentType, setContentType] = useState<ContentType>('image');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-card py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Tải Lên Nội Dung</h2>
            <p className="text-xl text-muted-foreground">Chia sẻ mô hình 3D, hình ảnh và video mới</p>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="text-6xl">⚙️</div>
                <h3 className="text-xl font-semibold">Tính năng upload đang được cấu hình</h3>
                <p className="text-muted-foreground">
                  Để sử dụng tính năng tải lên file, quản trị viên cần cấu hình các biến môi trường Supabase.
                </p>
                <div className="text-sm text-muted-foreground bg-muted p-4 rounded">
                  <p className="font-mono">VITE_SUPABASE_URL</p>
                  <p className="font-mono">VITE_SUPABASE_ANON_KEY</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const uploadMutation = useMutation({
    // DÙNG HÀM MỚI: uploadViaSignedURL
    mutationFn: async (data: { file: File; contentType: ContentType; title: string; password: string }) => {
      const bucket =
        data.contentType === 'image' ? 'images' :
        data.contentType === 'video' ? 'videos' : 'models';

      const folder = data.title?.trim() || undefined;

      await uploadViaSignedURL(data.file, bucket, folder, data.password);
      const res: UploadResponse = { ok: true, kind: data.contentType, message: 'Upload thành công!'};
      return res;
    },
    onSuccess: (data) => {
      toast({
        title: 'Upload thành công!',
        description: `File đã được tải lên: ${file?.name}`,
      });

      // refresh list
      const bucketName = contentType === 'image' ? 'images' : contentType === 'video' ? 'videos' : 'models';
      queryClient.invalidateQueries({ queryKey: ['/api/content', bucketName] });

      // reset form
      setFile(null);
      setTitle('');
      setUploadProgress(0);

      // show public URL
      setTimeout(() => {
        toast({
          title: 'URL công khai',
          description: data.message || 'File đã được tải lên thành công!',
          duration: 8000,
        });
      }, 800);
    },
    onError: (error: Error) => {
      toast({
        title: 'Lỗi upload',
        description: error.message,
        variant: 'destructive',
      });
      setUploadProgress(0);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn file để tải lên!',
        variant: 'destructive',
      });
      return;
    }

    // Giới hạn 200MB
    if (file.size > 200 * 1024 * 1024) {
      toast({
        title: 'Lỗi',
        description: 'File quá lớn! Giới hạn 200MB.',
        variant: 'destructive',
      });
      return;
    }

    // Validate kiểu file
    const validTypes: Record<ContentType, string[]> = {
      image: ['image/png', 'image/jpeg', 'image/jpg'],
      video: ['video/mp4', 'video/webm'],
      model: ['model/gltf+json', 'model/gltf-binary', 'application/octet-stream'],
    };

    const isValidType =
      contentType === 'model'
        ? validTypes[contentType].includes(file.type) ||
          file.name.toLowerCase().endsWith('.glb') ||
          file.name.toLowerCase().endsWith('.gltf')
        : validTypes[contentType].includes(file.type);

    if (!isValidType) {
      toast({
        title: 'Lỗi',
        description: 'Loại file không hợp lệ!',
        variant: 'destructive',
      });
      return;
    }

    // Hỏi mật khẩu upload
    const password = prompt('Nhập mật khẩu upload:');
    if (!password) {
      toast({
        title: 'Lỗi',
        description: 'Cần mật khẩu để tải lên!',
        variant: 'destructive',
      });
      return;
    }

    // Simulate progress
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + 10;
        if (next >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return next;
      });
    }, 180);

    try {
      await uploadMutation.mutateAsync({ file, contentType, title, password });
      setUploadProgress(100);
    } catch {
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  };

  const getAcceptTypes = (type: ContentType) => {
    switch (type) {
      case 'image': return '.png,.jpg,.jpeg';
      case 'video': return '.mp4,.webm';
      case 'model': return '.glb,.gltf';
      default: return '';
    }
  };

  const getIcon = (type: ContentType) => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'model': return <Box className="w-5 h-5" />;
      default: return <FileIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-card py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Tải Lên Nội Dung</h2>
          <p className="text-xl text-muted-foreground">Chia sẻ mô hình 3D, hình ảnh và video mới</p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="content-type" className="text-sm font-medium mb-2 block">
                  Loại Nội Dung
                </Label>
                <Select value={contentType} onValueChange={(v: ContentType) => setContentType(v)}>
                  <SelectTrigger data-testid="select-content-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">
                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4" /> Hình Ảnh (PNG, JPG)
                      </div>
                    </SelectItem>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" /> Video (MP4, WebM)
                      </div>
                    </SelectItem>
                    <SelectItem value="model">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4" /> Mô Hình 3D (GLB, GLTF)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-input" className="text-sm font-medium mb-2 block">
                  Chọn File
                </Label>
                <Input
                  id="file-input"
                  type="file"
                  accept={getAcceptTypes(contentType)}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  data-testid="input-file"
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {file ? (
                    <span data-testid="file-info">
                      File được chọn: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
                    </span>
                  ) : (
                    <span>Giới hạn: 200MB</span>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="content-title" className="text-sm font-medium mb-2 block">
                  Tiêu Đề (Tùy chọn)
                </Label>
                <Input
                  id="content-title"
                  type="text"
                  placeholder="Nhập tiêu đề cho nội dung..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-title"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3 flex items-center justify-center gap-3"
                disabled={uploadMutation.isPending}
                data-testid="button-submit-upload"
              >
                {getIcon(contentType)}
                {uploadMutation.isPending ? 'Đang tải lên...' : 'Đăng Tải'}
              </Button>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div data-testid="upload-progress">
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Đang tải lên... {uploadProgress}%
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Bằng cách tải lên nội dung, bạn xác nhận rằng bạn có quyền sử dụng và chia sẻ tài liệu này.
          </p>
        </div>
      </div>
    </div>
  );
}
