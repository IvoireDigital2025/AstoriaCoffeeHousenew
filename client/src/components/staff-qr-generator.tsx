import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { QrCode, Download, Eye, EyeOff, Copy, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

interface StaffQRGeneratorProps {
  domain?: string;
}

export default function StaffQRGenerator({ domain = "localhost:5000" }: StaffQRGeneratorProps) {
  const { toast } = useToast();
  const [selectedAccess, setSelectedAccess] = useState<string>("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const accessOptions = [
    {
      id: "staff-portal",
      name: "Staff Access Portal",
      description: "Main staff access page",
      url: `https://${domain}/staff`,
      color: "blue"
    },
    {
      id: "direct-admin",
      name: "Direct Admin Login",
      description: "Skip to admin login",
      url: `https://${domain}/admin/login`,
      color: "red"
    },
    {
      id: "staff-code-coffee",
      name: "Staff Portal + Code: COFFEE2025",
      description: "Portal with embedded access code",
      url: `https://${domain}/staff?code=COFFEE2025`,
      color: "green"
    },
    {
      id: "staff-code-astoria",
      name: "Staff Portal + Code: ASTORIA23",
      description: "Portal with location code", 
      url: `https://${domain}/staff?code=ASTORIA23`,
      color: "purple"
    }
  ];

  const generateQRCode = async (url: string) => {
    setIsGenerating(true);
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrCodeDataUrl(qrDataUrl);
      
      toast({
        title: "QR Code Generated",
        description: "Staff access QR code is ready for download",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate QR code. Please try again.",
        variant: "destructive",
      });
    }
    setIsGenerating(false);
  };

  const handleGenerateQR = () => {
    const selected = accessOptions.find(opt => opt.id === selectedAccess);
    if (selected) {
      generateQRCode(selected.url);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const selected = accessOptions.find(opt => opt.id === selectedAccess);
      const link = document.createElement('a');
      link.download = `coffee-pro-staff-access-${selected?.id || 'qr'}.png`;
      link.href = qrCodeDataUrl;
      link.click();
      
      toast({
        title: "QR Code Downloaded",
        description: "Print and place in staff areas",
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: "Access URL copied successfully",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const selectedOption = accessOptions.find(opt => opt.id === selectedAccess);

  return (
    <div className="space-y-6">
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-200 rounded-full">
              <QrCode className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <CardTitle className="text-lg text-amber-800">Staff Access QR Generator</CardTitle>
              <p className="text-sm text-amber-700 mt-1">
                Generate QR codes for staff to access admin features
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-amber-800">
              Select Access Type
            </label>
            <Select value={selectedAccess} onValueChange={setSelectedAccess}>
              <SelectTrigger className="bg-white border-amber-300">
                <SelectValue placeholder="Choose staff access method" />
              </SelectTrigger>
              <SelectContent>
                {accessOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-${option.color}-600 border-${option.color}-300`}>
                        {option.color}
                      </Badge>
                      <div>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-xs text-slate-600">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOption && (
            <div className="bg-white p-4 rounded-lg border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Target URL:</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(selectedOption.url)}
                  className="h-8 w-8 p-0"
                >
                  <Clipboard className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <code className="text-xs bg-slate-100 p-2 rounded block break-all text-slate-600">
                  {showAccessCode ? selectedOption.url : selectedOption.url.replace(/code=[^&]+/, 'code=***')}
                </code>
                {selectedOption.url.includes('code=') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAccessCode(!showAccessCode)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  >
                    {showAccessCode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                )}
              </div>
              
              <Button
                onClick={handleGenerateQR}
                disabled={isGenerating}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isGenerating ? "Generating..." : "Generate QR Code"}
              </Button>
            </div>
          )}

          {qrCodeDataUrl && (
            <div className="bg-white p-6 rounded-lg border border-amber-200 text-center space-y-4">
              <img 
                src={qrCodeDataUrl} 
                alt="Staff Access QR Code"
                className="mx-auto max-w-[200px] border border-slate-200 rounded"
              />
              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  QR Code for: <span className="font-medium">{selectedOption?.name}</span>
                </p>
                <Button
                  onClick={downloadQRCode}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Staff QR Code Placement Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Place behind the main register counter</li>
              <li>• Post in the staff break room or office</li>
              <li>• Include in staff onboarding materials</li>
              <li>• Keep a copy in the manager's office</li>
              <li>• Replace codes monthly for security</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}