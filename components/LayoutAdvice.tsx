import React from 'react';
import { Layout } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface LayoutAdviceProps {
  description: string;
  imageUrl?: string;
  isGeneratingImage: boolean;
}

const LayoutAdvice: React.FC<LayoutAdviceProps> = ({ description, imageUrl, isGeneratingImage }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 h-full flex flex-col">
      <div className="bg-teal-600 p-4 text-white flex items-center gap-2">
        <Layout className="w-5 h-5" />
        <h2 className="font-bold text-lg">Bố trí Layout Ban Công</h2>
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line">{description}</p>
        
        <div className="mt-auto w-full rounded-xl overflow-hidden bg-gray-100 min-h-[250px] relative flex items-center justify-center border-2 border-dashed border-gray-300">
          {isGeneratingImage ? (
            <div className="text-center p-4">
              <LoadingSpinner />
              <p className="text-sm text-gray-500 mt-2">Đang vẽ phác thảo layout...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt="Layout minh họa" className="w-full h-full object-cover" />
          ) : (
            <p className="text-gray-400 text-sm">Chưa có hình ảnh minh họa</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutAdvice;