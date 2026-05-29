import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { CopyButton } from '../components/common/CopyButton';
import { Star, MapPin, Clock, UtensilsCrossed } from 'lucide-react';
import { Restaurant } from '../types';
import { restaurantData } from '../data/mockData';
import { sortByPinyin } from '../utils/pinyinSort';

const PAGE_SIZE = 5;

export const DiningPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const sortedData = useMemo(() => {
    return sortByPinyin(restaurantData);
  }, []);

  const displayedData = useMemo(() => {
    return sortedData.slice(0, page * PAGE_SIZE);
  }, [sortedData, page]);

  const hasMore = displayedData.length < sortedData.length;

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleDishClick = (restaurant: Restaurant) => {
    navigate(`/dining/${restaurant.id}`, { state: { restaurant } });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <Header title="本地餐厅推荐" />
      
      <div className="p-4">
        <div className="bg-[#2E8B9A]/10 rounded-xl p-3 mb-4">
          <p className="text-[#2E8B9A] text-lg font-medium text-center">
            人均50元以内的本地特色小饭店
          </p>
        </div>

        <div className="space-y-4">
          {displayedData.map((restaurant: Restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">👨‍🍳</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-yellow-600">{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-base mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>

                  {restaurant.distance && (
                    <div className="flex items-center gap-2 text-gray-500 text-base mb-2">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>距离 {restaurant.distance}km</span>
                    </div>
                  )}

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                      <span className="font-medium text-gray-700">推荐菜品：</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.recommendedDishes.map((dish, index) => (
                        <button
                          key={index}
                          onClick={() => handleDishClick(restaurant)}
                          className="bg-[#E8985A]/10 text-[#E8985A] px-3 py-1.5 rounded-full text-base hover:bg-[#E8985A]/20 transition-colors min-h-[40px]"
                        >
                          {dish}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">点击查看完整菜单</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-[#3CB371]">
                      人均 ¥{restaurant.avgPrice}
                    </div>
                    <CopyButton address={restaurant.address} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMore}
              className="px-8 py-3 bg-[#2E8B9A] text-white rounded-xl text-lg font-medium min-h-[48px] hover:bg-[#247080] active:bg-[#1d6069] transition-colors"
            >
              加载更多
            </button>
          </div>
        )}

        {!hasMore && displayedData.length > 0 && (
          <div className="py-8 text-center text-gray-400 text-lg">
            没有更多了
          </div>
        )}
      </div>
    </div>
  );
};
