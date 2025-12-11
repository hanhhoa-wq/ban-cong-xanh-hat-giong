import React from 'react';
import { Mistake } from '../types';
import { ClipboardList, AlertTriangle } from 'lucide-react';

interface CareGuideProps {
  checklist: string[];
  mistakes: Mistake[];
}

const CareGuide: React.FC<CareGuideProps> = ({ checklist, mistakes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* Checklist */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
        <div className="flex items-center gap-2 mb-4 text-blue-700">
          <ClipboardList className="w-6 h-6" />
          <h3 className="font-bold text-xl">Checklist Chăm Sóc</h3>
        </div>
        <ul className="space-y-3">
          {checklist.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-700">
              <input type="checkbox" className="mt-1.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mistakes */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
        <div className="flex items-center gap-2 mb-4 text-red-600">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="font-bold text-xl">Lỗi Thường Gặp</h3>
        </div>
        <div className="space-y-4">
          {mistakes.map((m, idx) => (
            <div key={idx} className="bg-red-50 p-3 rounded-lg">
              <p className="font-semibold text-red-800 text-sm">❌ {m.mistake}</p>
              <p className="text-green-800 text-sm mt-1">✅ {m.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareGuide;