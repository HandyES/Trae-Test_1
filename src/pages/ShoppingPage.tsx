import React, { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { ShoppingItem, ShoppingCategory } from '../types';
import { shoppingData } from '../data/mockData';

const categoryConfig = {
  vegetable: { label: '蔬菜', color: 'bg-green-500', bgColor: 'bg-green-50' },
  egg: { label: '鸡蛋', color: 'bg-yellow-500', bgColor: 'bg-yellow-50' },
  meat: { label: '肉类', color: 'bg-red-500', bgColor: 'bg-red-50' },
  milk: { label: '牛奶', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
};

const PAGE_SIZE = 5;

export const ShoppingPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<ShoppingCategory | 'all'>('all');

  const filteredData = useMemo(() => {
    if (selectedCategory === 'all') {
      return shoppingData;
    }
    return shoppingData.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const displayedData = useMemo(() => {
    return filteredData.slice(0, page * PAGE_SIZE);
  }, [filteredData, page]);

  const hasMore = displayedData.length < filteredData.length;

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleCategoryChange = (category: ShoppingCategory | 'all') => {
    setSelectedCategory(category);
    setPage(1);
  };

  const renderIcon = (category: ShoppingCategory) => {
    const config = categoryConfig[category];
    const icons: Record<ShoppingCategory, string> = {
      vegetable: '🥬',
      egg: '🥚',
      meat: '🥩',
      milk: '🥛',
    };
    return (
      <div className={`${config.bgColor} w-14 h-14 rounded-xl flex items-center justify-center`}>
        <span className="text-3xl">{icons[category]}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <Header title="今日菜价" />
      
      <div className="p-4">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-3 rounded-xl text-lg font-medium whitespace-nowrap min-h-[48px] transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#2E8B9A] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            全部
          </button>
          {(Object.keys(categoryConfig) as ShoppingCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-3 rounded-xl text-lg font-medium whitespace-nowrap min-h-[48px] transition-colors ${
                selectedCategory === category
                  ? 'bg-[#2E8B9A] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {categoryConfig[category].label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {displayedData.map((item: ShoppingItem) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                {renderIcon(item.category)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <span className="text-lg text-gray-500">/{item.unit}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {item.markets.map((market, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-base text-gray-700">{market.market}</span>
                        <span className="text-lg font-bold text-[#E8985A]">¥{market.price.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {item.markets.length === 1 && (
                    <p className="text-sm text-gray-400 mt-2">仅一个市场有数据</p>
                  )}
                  {item.markets.length >= 2 && (
                    <p className="text-sm text-gray-400 mt-2">共 {item.markets.length} 个市场报价</p>
                  )}
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
