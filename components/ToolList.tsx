import React from 'react';
import { ToolItem } from '../types';
import { ShoppingCart, ExternalLink } from 'lucide-react';

interface ToolListProps {
  tools: ToolItem[];
}

const ToolList: React.FC<ToolListProps> = ({ tools }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100 h-full">
      <div className="shopee-btn p-4 text-white flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        <h2 className="font-bold text-lg">Dụng Cụ Cần Thiết & Link Mua</h2>
      </div>
      <div className="p-6">
        <ul className="space-y-6">
          {tools.map((item, index) => (
            <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.reason}</p>
              </div>
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="shopee-btn text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:shadow-md transition-transform active:scale-95 whitespace-nowrap"
              >
                Mua trên Shopee
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ToolList;