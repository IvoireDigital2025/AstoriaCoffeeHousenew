import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Download, Globe } from 'lucide-react';

interface WebsiteQRCodeProps {
  size?: number;
  className?: string;
}

export default function WebsiteQRCode({ size = 200, className = "" }: WebsiteQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'coffee-pro-website-qr-code.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      // Generate QR code for the Coffee Pro website
      const websiteUrl = 'https://yourcoffeepro.com/';
      
      QRCode.toCanvas(canvasRef.current, websiteUrl, {
        width: size,
        margin: 2,
        color: {
          dark: '#2D1B1B', // Coffee dark color
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('Website QR Code generation error:', error);
      });
    }
  }, [size]);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-inner">
        <canvas 
          ref={canvasRef} 
          className="rounded-lg shadow-md"
        />
      </div>
      
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-coffee-medium font-medium">
            Website Access QR Code
          </span>
        </div>
        <p className="text-xs text-coffee-medium">
          Scan to visit Coffee Pro website and explore our menu
        </p>
        
        <Button 
          onClick={downloadQRCode}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
      </div>
    </div>
  );
}