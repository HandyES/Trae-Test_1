import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Review } from '../../types';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [showReviews, setShowReviews] = useState(false);
  const displayReviews = reviews.slice(0, 10);

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowReviews(!showReviews)}
        className="flex items-center gap-2 text-[#2E8B9A] font-medium text-lg min-h-[48px] py-2"
      >
        <span>其他人的评价</span>
        {showReviews ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      
      {showReviews && (
        <div className="space-y-3 mt-2">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{review.userName}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-lg">{review.content}</p>
              <span className="text-sm text-gray-400 mt-2 block">{review.createTime}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
