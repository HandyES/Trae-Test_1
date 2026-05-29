import React, { useEffect, useRef } from 'react';
import { Loader } from 'lucide-react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  hasMore,
  loading,
}) => {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if (!hasMore) {
    return (
      <div className="py-8 text-center text-gray-400 text-lg">
        没有更多数据了
      </div>
    );
  }

  return (
    <div ref={observerRef} className="py-8 flex justify-center">
      {loading ? (
        <div className="flex items-center gap-2 text-[#2E8B9A]">
          <Loader className="w-6 h-6 animate-spin" />
          <span className="text-lg">加载中...</span>
        </div>
      ) : (
        <span className="text-gray-400 text-lg">下拉加载更多</span>
      )}
    </div>
  );
};
