import React from 'react';
import { Header } from '../components/layout/Header';
import { CopyButton } from '../components/common/CopyButton';
import { ReviewList } from '../components/common/ReviewList';
import { MapPin, PartyPopper } from 'lucide-react';
import { Entertainment } from '../types';
import { usePartyData } from '../hooks/useApiData';

const PAGE_SIZE = 5;

export const PartyPage: React.FC = () => {
  const { data, loading, error, hasMore, loadMore } = usePartyData(PAGE_SIZE);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <Header title="聚会场所" />
      
      <div className="p-4">
        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
            <p className="font-bold">提示</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        <div className="bg-[#8B5CF6]/10 rounded-xl p-3 mb-4">
          <p className="text-[#8B5CF6] text-lg font-medium text-center">
            适合聚会、聚餐、KTV等场所
          </p>
        </div>

        <div className="space-y-4">
          {data.map((place: Entertainment) => (
            <div key={place.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🎉</span>
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
                      <PartyPopper className="w-5 h-5" />
                      <span>免费入场</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#E8985A] font-bold text-lg mb-3">
                      <PartyPopper className="w-5 h-5" />
                      <span>人均 ¥{place.price}</span>
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
              onClick={loadMore}
              className="px-8 py-3 bg-[#2E8B9A] text-white rounded-xl text-lg font-medium min-h-[48px] hover:bg-[#247080] active:bg-[#1d6069] transition-colors"
            >
              加载更多
            </button>
          </div>
        )}

        {!hasMore && data.length > 0 && (
          <div className="py-8 text-center text-gray-400 text-lg">
            没有更多了
          </div>
        )}
        
        {!loading && data.length === 0 && (
          <div className="py-16 text-center text-gray-400 text-lg">
            暂无数据
          </div>
        )}
      </div>
    </div>
  );
};
