import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCodeComponent({ value, size = 200, className = "" }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
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
  }, [value, size]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`rounded-lg shadow-md ${className}`}
    />
  );
}