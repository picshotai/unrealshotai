"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

type SlideWithItems = {
  title: string;
  content: string;
  items: Array<{ text: string; icon: string }>;
  images: string[];
};

type SlideWithImages = {
  title: string;
  content: string;
  images: string[];
};

type GuidelineSection = {
  title: string;
  content: string[];
  highlight?: boolean;
};

type Slide = SlideWithItems | SlideWithImages;

const slides: Slide[] = [
  {
    title: "Photo Requirements",
    content: "The AI analyzes your photos to understand your appearance. It looks for features that show up in multiple images and uses them to create a consistent version of your look.",
    items: [
      { text: "No group shots", icon: "👥" },
      { text: "No blurry or low resolution photos", icon: "🖼️" },
      { text: "No caps or hats", icon: "🧢" },
      { text: "No silly faces", icon: "😜" },
      { text: "No car or mirror selfies", icon: "🚗" },
      { text: "No nudity", icon: "🔞" },
    ],
    images: [
      "/content/groupphoto.webp",
      "/content/blurryshot.webp",
      "/content/nocaps.webp",
      "/content/sillyface.webp",
      "/content/mirrorselfies.webp",
      "/content/nonudity.webp"
    ]
  },
  {
    title: "Guidelines for the Best Results When Training Your Model",
    content: "To achieve high-quality outcomes, you need the right image samples to train the model effectively.",
    images: []
  },
  {
    title: "Use Different Backgrounds, Outfits, and Expressions",
    content: "Uploading photos from various occasions, with different backgrounds, outfits, and expressions, helps the AI create a more accurate and well-rounded representation of your appearance.",
    images: ["/content/manoj.jpg", "/content/variety2.webp", "/content/variety3.webp", "/content/sumesh.webp"]
  }
];

const guidelines: GuidelineSection[] = [
  {
    title: "1. Number of Images",
    content: [
      "Use 4 to 10 high-quality natural images.",
      "For optimal results, aim for at least 8 images.",
      "Try to upload images where you are wearing different outfits."
    ]
  },
  {
    title: "2. Image Composition",
    content: [
      "4 clear face images: Ensure these are close-ups where your face is centered and clearly visible.",
      "2 side-profile images: One from a slight left angle and another from a slight right angle.",
      "2 body-length images: Capture up to your stomach to help the model understand your body shape."
    ],
    highlight: true
  },

  {
    title: "3. Additional Tips",
    content: [
      "Have only one person in each frame.",
      "Avoid accessories like sunglasses or hats that obscure facial features.",
      "Keep the background simple to help the model focus on your face."
    ]
  }
];

interface PhotoRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhotoRequirementsModal: React.FC<PhotoRequirementsModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const isSlideWithItems = (slide: Slide): slide is SlideWithItems => {
    return 'items' in slide;
  };

  const currentSlideContent = slides[currentSlide];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">{currentSlideContent.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-sm sm:text-base">{currentSlideContent.content}</p>
          
          {currentSlide === 1 && (
            <div className="space-y-6">
              {guidelines.map((section, index) => (
                <Card key={index} className={section.highlight ? 'border-2 border-primary bg-primary/5' : ''}>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <ul className="list-disc pl-4 space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
              <Alert>
                <AlertDescription className="text-sm italic">
                  Remember: The quality of the input determines the quality of the output. Invest time in selecting the right images to make the most of your efforts!
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {isSlideWithItems(currentSlideContent) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currentSlideContent.items.map((item, index) => (
                <div key={index} className="border border-red-500 rounded-lg p-2">
                  <div className="aspect-[4/5] mb-2">
                    <img 
                      src={currentSlideContent.images[index]} 
                      alt={item.text} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <p className="text-center text-xs sm:text-sm">
                    <span className="mr-1">{item.icon}</span>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {!isSlideWithItems(currentSlideContent) && currentSlide !== 1 && (
            <div className="grid grid-cols-2 gap-4">
              {currentSlideContent.images.map((img, index) => (
                <div key={index} className="aspect-[4/5]">
                  <img 
                    src={img} 
                    alt={`Example ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-6">
            <button onClick={prevSlide} className="bg-gray-200 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">&larr;</button>
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="bg-gray-200 px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base">&rarr;</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoRequirementsModal;
