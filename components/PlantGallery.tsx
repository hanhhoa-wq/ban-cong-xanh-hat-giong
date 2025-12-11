import React from 'react';
import { PlantInfo } from '../types';
import { Sprout } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface PlantGalleryProps {
  plants: PlantInfo[];
  plantImages: Record<string, string>;
  generatingImages: Record<string, boolean>;
}

const PlantGallery: React.FC<PlantGalleryProps> = ({ plants, plantImages, generatingImages }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-green-100 p-2 rounded-lg">
          <Sprout className="w-6 h-6 text-green-700" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Cây Trồng Phù Hợp</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plants.map((plant, index) => {
            const isLoading = generatingImages[plant.name];
            const imageUrl = plantImages[plant.name];

            return (
              <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden border border-green-50 hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 w-full bg-gray-100 relative flex items-center justify-center">
                  {isLoading ? (
                    <div className="text-center">
                       <LoadingSpinner />
                       <span className="text-xs text-gray-500">Đang vẽ cây...</span>
                    </div>
                  ) : imageUrl ? (
                    <img src={imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm px-4 text-center">Đang chờ hình ảnh...</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-green-800 mb-2">{plant.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{plant.description}</p>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default PlantGallery;