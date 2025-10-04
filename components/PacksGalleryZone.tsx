"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import Link from "next/link";
import { Progress } from "./ui/progress";
import { Loader2, Eye, Play } from "lucide-react";
import PackPreviewModal from "./PackPreviewModal";

// Astria API Pack interface based on documentation
interface Pack {
  id: string;
  slug: string;
  title: string;
  cover_url: string;
  created_at?: string;
  updated_at?: string;
  public_at?: string;
  costs?: {
    woman: {
      cost: number;
      num_images: number;
    };
    man: {
      cost: number;
      num_images: number;
    };
  };
}

export default function PacksGalleryZone() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<{ slug: string; title: string } | null>(null);
  const { toast } = useToast();

  const handlePreviewClick = (pack: Pack, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPack({ slug: pack.slug, title: pack.title });
    setModalOpen(true);
  };

  const fetchPacks = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Pack[]>("/astria/packs");
      setPacks(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: "Error fetching packs",
          description: err.message,
          duration: 5000,
        });
      } else {
        toast({
          title: "Unknown error",
          description: "An unknown error occurred.",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <Progress className="w-64" />
        <p className="mt-4 text-sm text-gray-500">Loading packs...</p>
      </div>
    );
  }

  if (packs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-500">No packs available.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className="group relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200/60"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={
                  pack.cover_url ??
                  "https://www.astria.ai/assets/logo-b4e21f646fb5879eb91113a70eae015a7413de8920960799acb72c60ad4eaa99.png"
                }
                alt={pack.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 sm:p-4">
              <h3 className="text-gray-900 font-semibold text-base capitalize leading-tight line-clamp-2 mb-3 text-sm sm:text-md">
                {pack.title}
              </h3>
              
              {/* Train Button */}
              <Link href={`/models/train/${pack.slug}`} className="block">
                <button className="text-sm w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer">
                  <Play className="h-4 w-4" />
                  Start Training
                </button>
              </Link>
            </div>
            
            {/* Preview Button - Top Right Corner */}
            <button
              onClick={(e) => handlePreviewClick(pack, e)}
              className="cursor-pointer absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md z-10"
              title="Preview Pack Images"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedPack && (
        <PackPreviewModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          packSlug={selectedPack.slug}
        />
      )}
    </>
  );
}
