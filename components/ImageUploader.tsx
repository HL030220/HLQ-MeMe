import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, selectedImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const triggerClick = () => {
    fileInputRef.current?.click();
  };

  if (selectedImage) {
    return (
      <div className="relative group w-full h-64 md:h-80 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-100 transition-all hover:shadow-2xl">
        <img 
          src={selectedImage} 
          alt="Original Character" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={onClear}
            className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur text-white text-xs px-3 py-1 rounded-full font-medium">
          Original Character
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={triggerClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full h-64 md:h-80 rounded-2xl border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-brand-500 bg-brand-50 scale-[1.02]' 
          : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50'
        }
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className={`p-6 rounded-full bg-brand-50 mb-4 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
        <Upload className={`w-10 h-10 ${isDragging ? 'text-brand-600' : 'text-brand-400'}`} />
      </div>
      
      <p className="text-xl font-display font-semibold text-gray-700 mb-2">
        Upload Character
      </p>
      <p className="text-sm text-gray-400 text-center max-w-[80%]">
        Click or drag & drop your character image here
      </p>
    </div>
  );
};
