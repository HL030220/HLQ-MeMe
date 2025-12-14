import React from 'react';
import { Download, Sparkles, Share2 } from 'lucide-react';
import { Button } from './Button';

interface StickerResultProps {
  imageUrl: string | null;
  isLoading: boolean;
}

export const StickerResult: React.FC<StickerResultProps> = ({ imageUrl, isLoading }) => {
  
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `q-meme-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="w-full h-80 md:h-[500px] rounded-3xl bg-white border-2 border-gray-100 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-purple-50/50" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 mb-6 relative">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-brand-400 animate-pulse" />
          </div>
          <p className="text-lg font-display font-semibold text-gray-700 animate-pulse">Generating Cuteness...</p>
          <p className="text-sm text-gray-400 mt-2">This might take a few seconds</p>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full h-80 md:h-[500px] rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ImageIcon className="w-10 h-10 text-gray-300" />
        </div>
        <p className="font-medium">Your sticker will appear here</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col animate-in fade-in zoom-in duration-500">
      <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <img 
          src={imageUrl} 
          alt="Generated Sticker" 
          className="max-w-[85%] max-h-[85%] object-contain drop-shadow-2xl transform transition-transform duration-300 hover:scale-105"
        />

        <div className="absolute bottom-6 right-6 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Button 
            onClick={handleDownload} 
            variant="primary" 
            className="shadow-xl"
            icon={<Download className="w-5 h-5" />}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const ImageIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);
