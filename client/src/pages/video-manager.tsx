import { useState } from "react";
import VideoUpload from "@/components/video-upload";
import VideoGallery from "@/components/video-gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Upload, List } from "lucide-react";

export default function VideoManager() {
  const [activeTab, setActiveTab] = useState("gallery");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleVideoUploaded = () => {
    // Refresh the gallery when a video is uploaded
    setRefreshTrigger(prev => prev + 1);
    setActiveTab("gallery");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-coffee-dark mb-2">Video Manager</h1>
          <p className="text-coffee-medium">Upload and manage videos about your coffee shop</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Video Gallery
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Your Coffee Shop Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VideoGallery key={refreshTrigger} showUploadCount={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <VideoUpload onVideoUploaded={handleVideoUploaded} />
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-6 bg-coffee-primary/5 rounded-lg border border-coffee-accent/20">
          <h3 className="text-lg font-semibold text-coffee-dark mb-3">Video Guidelines</h3>
          <ul className="space-y-2 text-coffee-medium">
            <li>• Upload authentic videos about your coffee shop experience</li>
            <li>• Keep videos under 100MB for best performance</li>
            <li>• Supported formats: MP4, MOV, AVI, WebM</li>
            <li>• Videos will be displayed on your website to showcase your coffee shop</li>
            <li>• Include engaging titles and descriptions to connect with customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}