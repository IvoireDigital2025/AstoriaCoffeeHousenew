import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
}

export function LazyImage({ src, alt, className, loading = 'lazy', placeholder }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={className} ref={imgRef}>
      {(isInView || loading === 'eager') && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} w-full h-full object-cover`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">{placeholder}</span>
        </div>
      )}
    </div>
  );
}