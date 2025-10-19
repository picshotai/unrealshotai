'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl, title = "Video" }: VideoModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-[95%] max-w-4xl mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 -right-2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 transition-colors duration-200 group"
          aria-label="Close video"
        >
          <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
        </button>
        
        {/* Video Container */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
          <video
            className="absolute inset-0 w-full h-full"
            controls
            autoPlay
            preload="metadata"
            poster="/images/howtothumbnail.webp"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Optional Title */}
        {title && (
          <div className="px-6 py-4 bg-gradient-to-r from-[#ff6f00]/10 to-orange-100/10">
            <h3 className="text-white text-lg font-semibold">{title}</h3>
          </div>
        )}
      </div>
    </div>
  );
}