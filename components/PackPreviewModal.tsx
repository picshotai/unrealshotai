import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Calendar, Image as ImageIcon, DollarSign, Users } from "lucide-react";
import axios from "axios";

// Astria API interfaces based on documentation
interface PackPrompt {
  id: number;
  images: string[];
  prompt?: string;
  created_at?: string;
}



interface DetailedPack {
  id: string;
  slug: string;
  title: string;
  cover_url: string;
  prompts_per_class: {
    woman: PackPrompt[];
    man: PackPrompt[];
  };
}

interface PackPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  packSlug: string | null;
}

export default function PackPreviewModal({
  isOpen,
  onClose,
  packSlug,
}: PackPreviewModalProps) {
  const [packData, setPackData] = useState<DetailedPack | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("woman");

  const fetchPackDetails = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/astria/packs/${slug}`);
      setPackData(response.data);
    } catch (error) {
      console.error("Error fetching pack details:", error);
      setError("Failed to load pack details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && packSlug) {
      fetchPackDetails(packSlug);
    }
  }, [isOpen, packSlug]);

  const renderImageGrid = (images: PackPrompt[]) => {
    if (!images || images.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
          <p>No images available for this category</p>
        </div>
      );
    }

    // Flatten all images from all prompts - show ALL images, not just first 12
    const allImages = images.flatMap((prompt, promptIndex) => 
      prompt.images.map((imageUrl, imageIndex) => ({
        id: `${prompt.id}-${imageIndex}`,
        url: imageUrl,
        prompt: prompt.prompt,
        created_at: prompt.created_at
      }))
    );

    return (
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        {allImages.map((image, index) => (
          <div
            key={image.id || index}
            className="aspect-square relative group overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-all duration-200"
          >
            <img
              src={image.url}
              alt={`Pack image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
            {image.created_at && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(image.created_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getGenderStats = (packData: DetailedPack) => {
    const womanCount = packData.prompts_per_class.woman?.length || 0;
    const manCount = packData.prompts_per_class.man?.length || 0;
    return { womanCount, manCount, total: womanCount + manCount };
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {loading ? "Loading..." : packData?.title || "Pack Preview"}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Please Wait, Loading pack details...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {packData && !loading && (
          <div className="space-y-6">
            {/* Explanatory Text */}
            <div className="py-3 px-4 bg-gray-200 rounded-lg border border-gray-300">
              <p className="text-sm text-gray-800 font-medium">
                The style of images you'll get with this pack
              </p>
              <p className="text-xs text-gray-600 mt-1">
                These are sample images showing the quality and style you can expect when training with this pack
              </p>
            </div>

            {/* Image Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="woman" className="flex items-center gap-2">
                  Woman
                  <Badge variant="secondary" className="ml-1">
                    {getGenderStats(packData).womanCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="man" className="flex items-center gap-2">
                  Man
                  <Badge variant="secondary" className="ml-1">
                    {getGenderStats(packData).manCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="woman" className="mt-4">
                {renderImageGrid(packData.prompts_per_class.woman)}
              </TabsContent>

              <TabsContent value="man" className="mt-4">
                {renderImageGrid(packData.prompts_per_class.man)}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}