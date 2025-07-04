import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, X, Play } from "lucide-react";

interface VideoUploadProps {
  onVideoUploaded?: (videoData: any) => void;
}

export default function VideoUpload({ onVideoUploaded }: VideoUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a video file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a video under 100MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a video file and provide a title",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('title', title);
      formData.append('description', description);

      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Upload Successful",
          description: "Your video has been uploaded successfully!",
        });
        
        // Reset form
        setSelectedFile(null);
        setPreviewUrl("");
        setTitle("");
        setDescription("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Notify parent component
        if (onVideoUploaded) {
          onVideoUploaded(result);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border border-coffee-accent/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-coffee-dark">
          <Video className="w-5 h-5 text-coffee-primary" />
          Upload Coffee Shop Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div className="space-y-4">
          <Label htmlFor="video-upload" className="text-coffee-dark font-medium">
            Select Video File
          </Label>
          <div 
            className="border-2 border-dashed border-coffee-accent/30 rounded-lg p-8 text-center hover:border-coffee-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              ref={fileInputRef}
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Video className="w-8 h-8 text-coffee-primary" />
                  <span className="text-coffee-dark font-medium">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-coffee-medium">
                  Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-12 h-12 text-coffee-medium mx-auto" />
                <div>
                  <p className="text-coffee-dark font-medium">Click to upload a video</p>
                  <p className="text-sm text-coffee-medium">
                    MP4, MOV, AVI, WebM (Max 100MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Preview */}
        {previewUrl && (
          <div className="space-y-2">
            <Label className="text-coffee-dark font-medium">Preview</Label>
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                src={previewUrl}
                controls
                className="w-full h-64 object-contain"
                style={{ maxHeight: '256px' }}
              />
            </div>
          </div>
        )}

        {/* Video Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-coffee-dark font-medium">
              Video Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Welcome to Coffee Pro - Our Story"
              className="mt-1 bg-coffee-cream/30 border-coffee-accent/30"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-coffee-dark font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about your video - what makes your coffee shop special?"
              rows={3}
              className="mt-1 bg-coffee-cream/30 border-coffee-accent/30 resize-none"
            />
          </div>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !title.trim() || isUploading}
          className="w-full bg-gradient-to-r from-coffee-primary to-amber-600 hover:from-coffee-dark hover:to-amber-700"
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-coffee-medium">
            By uploading, you confirm this video represents your coffee shop authentically
          </p>
        </div>
      </CardContent>
    </Card>
  );
}