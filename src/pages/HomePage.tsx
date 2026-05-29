import React from 'react';
import { MapPin } from 'lucide-react';
import { CategoryGrid } from '../components/home/CategoryGrid';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <header className="bg-gradient-to-r from-[#2E8B9A] to-[#3CB371] text-white">
        <div className="px-4 pt-8 pb-6">
          <h1 className="text-3xl font-bold mb-2">银川本地生活</h1>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">宁夏回族自治区银川市</span>
          </div>
        </div>
      </header>
      
      <CategoryGrid />
      
      <footer className="mt-8 py-6 text-center text-gray-400 text-sm">
        <p>银川本地生活服务</p>
        <p className="mt-1">数据来源：高德地图、美团、大众点评等</p>
      </footer>
    </div>
  );
};
