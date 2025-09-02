import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'lucide-react';
import ImageLightbox from '@/components/image-lightbox';
import ContentActionsMenu from '@/components/content-actions-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'wouter';

interface ImageFile {
  name: string;
  url: string;
  created_at: string;
  metadata?: {
    size: number;
    title?: string;
    description?: string;
  };
}
const API_URL = import.meta.env.VITE_API_URL;

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { data: images, isLoading, error } = useQuery<ImageFile[]>({
    queryKey: [`${API_URL}/api/content/images`],
  });

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const previousImage = () => {
    if (images) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const nextImage = () => {
    if (images) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const lightboxImages = images?.map(img => ({
    src: img.url,
    alt: img.metadata?.title || img.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, ""),
    title: img.metadata?.title || img.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, ""),
    description: img.metadata?.description || 'Concept art và screenshot từ quá trình phát triển Hào Khí Lửa Tre'
  })) || [];

  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Thư Viện Ảnh</h2>
            <p className="text-destructive">Không thể tải danh sách hình ảnh. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Thư Viện Ảnh</h2>
          <p className="text-xl text-muted-foreground">Concept art và screenshot từ quá trình phát triển</p>
        </div>
        
        {isLoading ? (
          <div className="masonry">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="masonry-item">
                <Skeleton className={`w-full rounded-lg ${i % 3 === 0 ? 'h-80' : i % 3 === 1 ? 'h-64' : 'h-96'}`} />
              </div>
            ))}
          </div>
        ) : !images || images.length === 0 ? (
          <div className="text-center py-20">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Chưa có hình ảnh</h3>
            <p className="text-muted-foreground mb-4">Hiện tại chưa có hình ảnh nào được tải lên.</p>
            <Link href="/upload">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
                Tải lên hình ảnh đầu tiên
              </button>
            </Link>
          </div>
        ) : (
          <div className="masonry">
            {images.map((image, index) => (
              <div key={image.name} className="masonry-item relative">
                <img
                  src={image.url}
                  alt={image.metadata?.title || image.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, "")}
                  className="w-full rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => openLightbox(index)}
                  data-testid={`gallery-image-${index}`}
                />
                <ContentActionsMenu
                  fileName={image.name}
                  bucket="images"
                  currentTitle={image.metadata?.title || image.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, "")}
                  currentDescription={image.metadata?.description || "Concept art và screenshot từ quá trình phát triển Hào Khí Lửa Tre"}
                />
              </div>
            ))}
          </div>
        )}

        <ImageLightbox
          isOpen={lightboxOpen}
          images={lightboxImages}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onPrevious={previousImage}
          onNext={nextImage}
        />
      </div>
    </div>
  );
}
