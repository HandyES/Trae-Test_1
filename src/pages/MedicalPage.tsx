import React, { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { CopyButton } from '../components/common/CopyButton';
import { MapPin, Phone, Building2 } from 'lucide-react';
import { Medical, MedicalLevel } from '../types';
import { medicalData } from '../data/mockData';
import { sortByPinyin } from '../utils/pinyinSort';

const levelConfig: Record<MedicalLevel, { label: string; color: string; bgColor: string }> = {
  city: { label: '市级', color: 'text-red-600', bgColor: 'bg-red-100' },
  district: { label: '区级', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  community: { label: '社区', color: 'text-blue-600', bgColor: 'bg-blue-100' },
};

const PAGE_SIZE = 5;

export const MedicalPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const sortedData = useMemo(() => {
    return sortByPinyin(medicalData);
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
      <Header title="周边医疗" />
      
      <div className="p-4">
        <div className="bg-[#DC3545]/10 rounded-xl p-3 mb-4">
          <p className="text-[#DC3545] text-lg font-medium text-center">
            周边5公里内的医疗机构
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {(Object.keys(levelConfig) as MedicalLevel[]).map((level) => (
              <div key={level} className="flex items-center gap-2">
                <div className={`${levelConfig[level].bgColor} w-4 h-4 rounded`}></div>
                <span className={`${levelConfig[level].color} font-medium`}>
                  {levelConfig[level].label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {displayedData.map((hospital: Medical) => (
            <div key={hospital.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🏥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{hospital.name}</h3>
                    <span className={`${levelConfig[hospital.level].bgColor} ${levelConfig[hospital.level].color} px-3 py-1 rounded-full text-base font-medium`}>
                      {levelConfig[hospital.level].label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-base mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{hospital.address}</span>
                  </div>

                  {hospital.distance && (
                    <div className="text-gray-500 text-base mb-2">
                      距离 {hospital.distance}km
                    </div>
                  )}

                  {hospital.phone && (
                    <div className="flex items-center gap-2 text-gray-500 text-base mb-3">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <a href={`tel:${hospital.phone}`} className="text-[#2E8B9A] hover:underline">
                        {hospital.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <CopyButton address={hospital.address} />
                    {hospital.phone && (
                      <a
                        href={`tel:${hospital.phone}`}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-lg bg-[#3CB371] text-white hover:bg-[#2e9957] active:bg-[#287a4e] transition-colors min-h-[48px]"
                      >
                        <Phone className="w-5 h-5" />
                        <span>拨打电话</span>
                      </a>
                    )}
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
