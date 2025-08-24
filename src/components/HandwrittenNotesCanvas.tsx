// components/HandwrittenNotesCanvas.tsx
import React, { useRef, useEffect, useState } from 'react';
import { Trash2, Download, Upload, Pen, Eraser } from 'lucide-react';

interface HandwrittenNotesCanvasProps {
  value?: string; // Base64 encoded image data
  onChange: (imageData: string) => void;
  width?: number;
  height?: number;
}

const HandwrittenNotesCanvas: React.FC<HandwrittenNotesCanvasProps> = ({
  value,
  onChange,
  width = 600,
  height = 400
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [brushSize, setBrushSize] = useState(2);
  const [brushColor, setBrushColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set default styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load existing image data if provided
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    } else {
      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [value, width, height]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (currentTool === 'pen') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
      } else {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushSize * 2;
      }

      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      // Save the canvas data as base64
      const imageData = canvas.toDataURL('image/png');
      onChange(imageData);
    }
  };

  // Touch events for mobile support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setIsDrawing(true);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (currentTool === 'pen') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
      } else {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = brushSize * 2;
      }

      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stopDrawing();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        onChange(canvas.toDataURL('image/png'));
      }
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `handwritten-notes-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const uploadImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Scale image to fit canvas while maintaining aspect ratio
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                
                onChange(canvas.toDataURL('image/png'));
              }
            }
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setCurrentTool('pen')}
          className={`flex items-center px-3 py-1 rounded text-sm ${
            currentTool === 'pen' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Pen className="w-4 h-4 mr-1" />
          Pen
        </button>
        
        <button
          onClick={() => setCurrentTool('eraser')}
          className={`flex items-center px-3 py-1 rounded text-sm ${
            currentTool === 'eraser' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Eraser className="w-4 h-4 mr-1" />
          Eraser
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-16"
          />
          <span className="text-sm text-gray-600 w-6">{brushSize}</span>
        </div>

        {currentTool === 'pen' && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Color:</label>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-8 h-6 border rounded"
            />
          </div>
        )}

        <div className="flex gap-1 ml-auto">
          <button
            onClick={uploadImage}
            className="flex items-center px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            title="Upload Image"
          >
            <Upload className="w-4 h-4" />
          </button>
          
          <button
            onClick={downloadImage}
            className="flex items-center px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={clearCanvas}
            className="flex items-center px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="border border-gray-200 rounded cursor-crosshair touch-none"
        style={{ 
          maxWidth: '100%', 
          height: 'auto',
          aspectRatio: `${width}/${height}`
        }}
      />

      <p className="text-xs text-gray-500 mt-2">
        Use your mouse or finger to draw handwritten notes. 
        {currentTool === 'pen' ? ' Drawing with pen.' : ' Erasing mode active.'}
      </p>
    </div>
  );
};

export default HandwrittenNotesCanvas;