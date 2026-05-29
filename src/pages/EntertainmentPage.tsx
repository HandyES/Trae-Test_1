import React, { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { CopyButton } from '../components/common/CopyButton';
import { ReviewList } from '../components/common/ReviewList';
import { MapPin, Ticket } from 'lucide-react';
import { Entertainment } from '../types';
import { entertainmentData } from '../data/mockData';
import { sortByPinyin } from '../utils/pinyinSort';

const PAGE_SIZE = 5;

export const EntertainmentPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const sortedData = useMemo(() => {
    return sortByPinyin(entertainmentData);
  }, []);

  const displayedData = useMemo(() => {
    return sortedData.slice(0, page * PAGE_SIZE);
  }, [sortedData, page]);

  const hasMore = displayedData.length < sortedData.length;

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <Header title="周边玩乐" />
      
      <div className="p-4">
        <div className="bg-[#2E8B9A]/10 rounded-xl p-3 mb-4">
          <p className="text-[#2E8B9A] text-lg font-medium text-center">
            周边5公里内的玩乐地点
          </p>
        </div>

        <div className="space-y-4">
          {displayedData.map((place: Entertainment) => (
            <div key={place.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🎲</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{place.name}</h3>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-base mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </div>

                  {place.distance && (
                    <div className="text-gray-500 text-base mb-2">
                      距离 {place.distance}km
                    </div>
                  )}

                  {place.price === 0 ? (
                    <div className="flex items-center gap-2 text-[#3CB371] font-bold text-lg mb-3">
                      <Ticket className="w-5 h-5" />
                      <span>免费</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#E8985A] font-bold text-lg mb-3">
                      <Ticket className="w-5 h-5" />
                      <span>门票 ¥{place.price}</span>
                    </div>
                  )}

                  <ReviewList reviews={place.reviews} />

                  <div className="mt-4">
                    <CopyButton address={place.address} />
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
