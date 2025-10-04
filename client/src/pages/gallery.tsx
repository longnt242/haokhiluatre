import { useRef, useState } from "react";
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { Image } from "lucide-react";
import ImageLightbox from "@/components/image-lightbox";
import ContentActionsMenu from "@/components/content-actions-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImageFile {
  name: string;
  url: string;
  dimension: string;
  created_at: string;
  metadata?: {
    size: number;
    title?: string;
    description?: string;
  };
}
const API_URL = import.meta.env.VITE_API_URL;

export default function Gallery() {
  const [dimension, setDimension] = useState("ALL");
  const options = ["ALL", "2D", "3D", "BehindTheScene"];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function getBucketName(url: string) {
    const parts = url.split("/public/");
    if (parts.length < 2) return null;
    return parts[1].split("/")[0]; // Take text before next slash
  }

  // Helper fetcher
  const fetchImages = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
  };

  // Case 1: If ALL → fetch both 2D and 3D
  const queries = useQueries({
    queries: [
      {
        queryKey: ["2DImages", dimension],
        queryFn: () => fetchImages(`${API_URL}/api/content/2DImage`),
        enabled: dimension === "ALL" || dimension === "2D",
        placeholderData: keepPreviousData,
      },
      {
        queryKey: ["3DImages", dimension],
        queryFn: () => fetchImages(`${API_URL}/api/content/3DImage`),
        enabled: dimension === "ALL" || dimension === "3D",
        placeholderData: keepPreviousData,
      },
      {
        queryKey: ["BehindTheScene", dimension],
        queryFn: () => fetchImages(`${API_URL}/api/content/BehindTheScene`),
        enabled: dimension === "ALL" || dimension === "BehindTheScene",
        placeholderData: keepPreviousData,
      },
    ],
  });

  // Merge data safely (fallback to [])
  const images: ImageFile[] = [
    ...(queries[0].data ?? []),
    ...(queries[1].data ?? []),
    ...(queries[2].data ?? []),
  ];

  // Safe loading & errors
  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const previousImage = () => {
    if (images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const nextImage = () => {
    if (images) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const lightboxImages =
    images?.map((img) => ({
      src: img.url,
      alt:
        img.metadata?.title ||
        img.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, ""),
      title:
        img.metadata?.title ||
        img.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, ""),
      description:
        img.metadata?.description ||
        "Concept art và screenshot từ quá trình phát triển Hào Khí Lửa Tre",
    })) || [];

  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Thư Viện Ảnh
            </h2>
            <p className="text-destructive">
              Không thể tải danh sách hình ảnh. Vui lòng thử lại sau.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Thư Viện Ảnh
          </h2>
          <p className="text-xl text-muted-foreground">
            Concept art và screenshot từ quá trình phát triển
          </p>
        </div>

        <div className="mb-8">
          <Select value={dimension} onValueChange={setDimension}>
            <SelectTrigger className="w-28 h-12 bg-black text-lg">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="bg-black border rounded shadow">
              <SelectGroup>
                {options.map((opt) => (
                  <SelectItem
                    key={opt}
                    value={opt}
                    className="text-center hover:bg-primary cursor-pointer"
                  >
                    {opt === "BehindTheScene" ? "Behind The Scene" : opt}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {isLoading ? (
          <div className="masonry">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="masonry-item">
                <Skeleton
                  className={`w-full rounded-lg ${
                    i % 3 === 0 ? "h-80" : i % 3 === 1 ? "h-64" : "h-96"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : !images || images.length === 0 ? (
          <div className="text-center py-20">
            <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Chưa có hình ảnh</h3>
            <p className="text-muted-foreground mb-4">
              Hiện tại chưa có hình ảnh nào được tải lên.
            </p>
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
                  alt={
                    image.metadata?.title ||
                    image.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, "")
                  }
                  className="w-full rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => openLightbox(index)}
                  data-testid={`gallery-image-${index}`}
                />
                <ContentActionsMenu
                  fileName={image.name}
                  bucket={getBucketName(image.url) || "2DImages"}
                  currentTitle={
                    image.metadata?.title ||
                    image.name.replace(/\.[^/.]+$/, "").replace(/^\d+-/, "")
                  }
                  currentDescription={
                    image.metadata?.description ||
                    "Concept art và screenshot từ quá trình phát triển Hào Khí Lửa Tre"
                  }
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
