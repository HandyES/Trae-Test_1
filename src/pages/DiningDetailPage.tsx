import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { CopyButton } from '../components/common/CopyButton';
import { MapPin, Star, Utensils } from 'lucide-react';
import { Restaurant } from '../types';

export const DiningDetailPage: React.FC = () => {
  const location = useLocation();
  const restaurant = location.state?.restaurant as Restaurant;

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#F8FAFB]">
        <Header title="菜单详情" />
        <div className="p-4">
          <div className="text-center text-gray-500 text-xl mt-8">
            未找到餐厅信息
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <Header title="菜单详情" />
      
      <div className="p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-4xl">👨‍🍳</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h2>
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-lg">{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-medium text-gray-700">{restaurant.rating}分</span>
                <span className="text-gray-400">|</span>
                <span className="text-lg text-[#3CB371] font-bold">人均 ¥{restaurant.avgPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-800">菜品菜单</h3>
          </div>
          
          <div className="space-y-3">
            {restaurant.dishes.map((dish, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-lg text-gray-800">{dish.name}</span>
                <span className="text-xl font-bold text-[#E8985A]">¥{dish.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <CopyButton address={restaurant.address} />
        </div>
      </div>
    </div>
  );
};
