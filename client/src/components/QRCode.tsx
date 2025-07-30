import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface QRCodeProps {
  size?: number;
  className?: string;
  mode?: 'admin' | 'dynamic'; // admin mode shows static QR, dynamic mode shows expiring tokens
}

export default function QRCodeComponent({ size = 200, className = "", mode = 'dynamic' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [token, setToken] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      // Create a download link
      const link = document.createElement('a');
      link.download = 'coffee-pro-loyalty-qr-code.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const generateToken = async () => {
    setIsGenerating(true);
    try {
      const response: any = await apiRequest('POST', '/api/qr/generate', {});
      setToken(response.token);
      setExpiresAt(response.permanent ? null : new Date(response.expiresAt));
      setTimeLeft(response.permanent ? 0 : response.validFor);
    } catch (error) {
      console.error('Failed to generate QR token:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (mode === 'admin') {
      // For admin mode, show static QR code that points to the check-in page
      const qrValue = `${window.location.origin}/loyalty/checkin`;
      
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, qrValue, {
          width: size,
          margin: 2,
          color: {
            dark: '#2D1B1B', // Coffee dark color
            light: '#FFFFFF'
          }
        }, (error) => {
          if (error) console.error('QR Code generation error:', error);
        });
      }
    } else {
      // For dynamic mode, generate tokens
      generateToken();
    }
  }, [mode, size]);

  useEffect(() => {
    if (mode === 'dynamic' && token && expiresAt) {
      const qrValue = `${window.location.origin}/loyalty/checkin?token=${token}`;
      
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, qrValue, {
          width: size,
          margin: 2,
          color: {
            dark: '#2D1B1B', // Coffee dark color
            light: '#FFFFFF'
          }
        }, (error) => {
          if (error) console.error('QR Code generation error:', error);
        });
      }
    }
  }, [token, size, mode]);

  useEffect(() => {
    if (mode === 'dynamic' && expiresAt) {
      const timer = setInterval(() => {
        const now = new Date();
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [expiresAt, mode]);

  // Admin mode renders static QR code
  if (mode === 'admin') {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <canvas 
            ref={canvasRef} 
            className="rounded-lg shadow-md"
          />
        </div>
        
        <div className="text-center space-y-3">
          <div className="text-sm text-coffee-medium">
            <span className="font-bold text-green-600">Always Active</span> - Display this QR code in your store
          </div>
          <p className="text-xs text-coffee-medium">
            When customers scan this code, they'll have 60 seconds to complete check-in
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

  // Dynamic mode renders expiring tokens
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-inner">
        <canvas 
          ref={canvasRef} 
          className="rounded-lg shadow-md"
        />
      </div>
      
      <div className="text-center space-y-2">
        <div className="text-sm text-coffee-medium">
          {timeLeft > 0 ? (
            <>Valid for <span className="font-bold text-coffee-dark">{timeLeft}s</span></>
          ) : (
            <span className="text-red-600 font-bold">Expired</span>
          )}
        </div>
        
        <Button 
          onClick={generateToken}
          disabled={isGenerating || timeLeft > 0}
          className="bg-coffee-primary hover:bg-coffee-medium text-white"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating...' : 'Generate New Code'}
        </Button>
      </div>
    </div>
  );
}