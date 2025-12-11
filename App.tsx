import React, { useState } from 'react';
import { GardeningAdviceResponse, UserInput } from './types';
import { generateGardeningAdvice, generateImage } from './services/geminiService';
import ToolList from './components/ToolList';
import LayoutAdvice from './components/LayoutAdvice';
import PlantGallery from './components/PlantGallery';
import CareGuide from './components/CareGuide';
import { Leaf, Sparkles, Sprout, Sun, Clock, Target, Ruler } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState<UserInput>({
    area: '',
    sunDirection: 'Đông',
    careTime: 'Trung bình',
    goal: 'Ăn sạch'
  });

  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);
  const [data, setData] = useState<GardeningAdviceResponse | null>(null);
  
  // Image generation states
  const [loadingLayoutImage, setLoadingLayoutImage] = useState<boolean>(false);
  const [layoutImageUrl, setLayoutImageUrl] = useState<string | undefined>(undefined);
  
  const [generatingPlantImages, setGeneratingPlantImages] = useState<Record<string, boolean>>({});
  const [plantImages, setPlantImages] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof UserInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const generateAll = async () => {
    if (!input.area) {
      alert("Vui lòng nhập diện tích ban công!");
      return;
    }

    setLoadingAdvice(true);
    setData(null);
    setLayoutImageUrl(undefined);
    setPlantImages({});
    setGeneratingPlantImages({});
    
    try {
      // 1. Generate Text Content
      const advice = await generateGardeningAdvice(input);
      setData(advice);
      setLoadingAdvice(false);

      // 2. Generate Layout Image
      if (advice.layout?.imagePrompt) {
        setLoadingLayoutImage(true);
        generateImage(advice.layout.imagePrompt).then((url) => {
          setLayoutImageUrl(url);
          setLoadingLayoutImage(false);
        });
      }

      // 3. Generate Plant Images
      const newGeneratingState: Record<string, boolean> = {};
      if (advice.plants && Array.isArray(advice.plants)) {
          advice.plants.forEach(p => newGeneratingState[p.name] = true);
          setGeneratingPlantImages(newGeneratingState);

          advice.plants.forEach((plant) => {
            if (plant.imagePrompt) {
                generateImage(plant.imagePrompt).then((url) => {
                    if (url) {
                        setPlantImages(prev => ({ ...prev, [plant.name]: url }));
                    }
                    setGeneratingPlantImages(prev => ({ ...prev, [plant.name]: false }));
                });
            } else {
                setGeneratingPlantImages(prev => ({ ...prev, [plant.name]: false }));
            }
          });
      }

    } catch (error) {
      console.error("Error generating content:", error);
      setLoadingAdvice(false);
      setLoadingLayoutImage(false);
      setGeneratingPlantImages({});
      alert("Đã có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-600 to-teal-600 p-2.5 rounded-xl text-white shadow-lg">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 leading-none">Ban Công Xanh Sài Gòn</h1>
              <span className="text-xs text-green-600 font-medium">Tư vấn trồng rau & Dụng cụ</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* Input Form Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-green-100 p-6 md:p-8 mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thiết kế khu vườn của bạn</h2>
            <p className="text-gray-500">Nhập thông tin để nhận tư vấn chi tiết và link mua dụng cụ phù hợp.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Area Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Ruler className="w-4 h-4 text-green-600" /> Diện tích (m²)
              </label>
              <input
                type="number"
                value={input.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                placeholder="VD: 3"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
              />
            </div>

            {/* Sun Direction */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Sun className="w-4 h-4 text-orange-500" /> Hướng nắng
              </label>
              <select
                value={input.sunDirection}
                onChange={(e) => handleInputChange('sunDirection', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all bg-white"
              >
                <option value="Đông">Hướng Đông (Nắng sáng)</option>
                <option value="Tây">Hướng Tây (Nắng chiều)</option>
                <option value="Nam">Hướng Nam (Nắng đều)</option>
                <option value="Bắc">Hướng Bắc (Ít nắng)</option>
                <option value="Hỗn hợp">Hỗn hợp / Bị che khuất</option>
              </select>
            </div>

            {/* Care Time */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4 text-blue-500" /> Thời gian chăm
              </label>
              <select
                value={input.careTime}
                onChange={(e) => handleInputChange('careTime', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all bg-white"
              >
                <option value="Ít">Ít (Cuối tuần)</option>
                <option value="Trung bình">Trung bình (15p/ngày)</option>
                <option value="Nhiều">Nhiều (Yêu cây)</option>
              </select>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Target className="w-4 h-4 text-red-500" /> Mục tiêu
              </label>
              <select
                value={input.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all bg-white"
              >
                <option value="Ăn sạch">Rau ăn hàng ngày</option>
                <option value="Decor">Trang trí xanh mát</option>
                <option value="Tiết kiệm">Tiết kiệm chi phí</option>
                <option value="Trồng thử">Trải nghiệm cho bé</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={generateAll}
              disabled={loadingAdvice}
              className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all ${
                loadingAdvice ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-teal-600 hover:-translate-y-1'
              }`}
            >
              {loadingAdvice ? (
                'AI đang phân tích...'
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Nhận Tư Vấn Ngay
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {data && (
          <div className="animate-fade-in space-y-10">
            {/* Greeting */}
            <div className="bg-gradient-to-r from-green-100 to-teal-50 border border-green-200 p-6 rounded-2xl text-center">
              <p className="text-green-900 text-lg font-medium italic">"{data.greeting}"</p>
            </div>

            {/* Layout Advice & Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LayoutAdvice 
                  description={data.layout?.description || "Đang cập nhật..."} 
                  imageUrl={layoutImageUrl} 
                  isGeneratingImage={loadingLayoutImage} 
              />
              <ToolList tools={data.tools || []} />
            </div>

            {/* Plants Gallery */}
            <PlantGallery 
                plants={data.plants || []} 
                plantImages={plantImages} 
                generatingImages={generatingPlantImages}
            />

            {/* Checklist & Mistakes */}
            <CareGuide checklist={data.checklist || []} mistakes={data.mistakes || []} />
          </div>
        )}

        {/* Intro Features */}
        {!data && !loadingAdvice && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-80">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-50 flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                 <Sprout className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-gray-800">Tư vấn đúng nhu cầu</h3>
               <p className="text-sm text-gray-500 mt-2">Phân tích hướng nắng và diện tích để chọn cây sống khỏe.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-50 flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                 <ShoppingCart className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-gray-800">Link mua dụng cụ</h3>
               <p className="text-sm text-gray-500 mt-2">Danh sách vật tư kèm link Shopee chính hãng, giá tốt.</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-50 flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                 <Sparkles className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-gray-800">Minh họa thực tế</h3>
               <p className="text-sm text-gray-500 mt-2">Xem trước ban công tương lai với công nghệ tạo ảnh AI.</p>
             </div>
          </div>
        )}
      </main>
      
      {/* Import Icon for Features section */}
    </div>
  );
};

// Helper for icon import in empty state
const ShoppingCart = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
);

export default App;