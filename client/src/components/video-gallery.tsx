import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";

interface Video {
  id: number;
  title: string;
  description: string | null;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

interface VideoGalleryProps {
  showUploadCount?: boolean;
  maxVideos?: number;
}

export default function VideoGallery({ showUploadCount = false, maxVideos }: VideoGalleryProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['/api/videos'],
    queryFn: async () => {
      const response = await fetch('/api/videos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      return response.json();
    }
  });

  const displayVideos = maxVideos ? videos?.slice(0, maxVideos) : videos;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Videos</h3>
          <p className="text-red-600">Please try refreshing the page</p>
        </CardContent>
      </Card>
    );
  }

  if (!displayVideos?.length) {
    return (
      <Card className="border-coffee-accent/20">
        <CardContent className="p-12 text-center">
          <Play className="w-16 h-16 text-coffee-medium mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-coffee-dark mb-2">No Videos Yet</h3>
          <p className="text-coffee-medium">
            Upload your first video to share your coffee shop story with visitors
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {showUploadCount && (
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-coffee-dark">
              Coffee Shop Videos ({displayVideos.length})
            </h3>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVideos.map((video: Video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow border border-coffee-accent/20">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-black">
                  <video
                    className="w-full h-full object-cover"
                    poster={`/api/videos/${video.id}/thumbnail`}
                    preload="metadata"
                  >
                    <source src={`/api/videos/${video.id}/stream`} type={video.mimeType} />
                  </video>
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => setSelectedVideo(video)}
                      className="bg-coffee-primary hover:bg-coffee-dark text-white"
                      size="lg"
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Watch Video
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-coffee-dark text-lg line-clamp-2">
                      {video.title}
                    </h4>
                    {video.description && (
                      <p className="text-coffee-medium text-sm mt-2 line-clamp-3">
                        {video.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-coffee-medium">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(video.createdAt), 'MMM d, yyyy')}
                    </div>
                    <Badge variant="outline" className="text-coffee-primary border-coffee-primary/30">
                      {(video.size / (1024 * 1024)).toFixed(1)} MB
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b border-coffee-accent/20 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-coffee-dark">
                {selectedVideo.title}
              </h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedVideo(null)}
                className="text-coffee-medium hover:text-coffee-dark"
              >
                ✕
              </Button>
            </div>
            
            <div className="p-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  src={`/api/videos/${selectedVideo.id}/stream`}
                />
              </div>
              
              {selectedVideo.description && (
                <div className="space-y-2">
                  <h4 className="font-medium text-coffee-dark">About This Video</h4>
                  <p className="text-coffee-medium">
                    {selectedVideo.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}