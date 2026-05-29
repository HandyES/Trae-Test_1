import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center h-16 px-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
          aria-label="返回"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold text-gray-800 pr-10">
          {title}
        </h1>
      </div>
    </header>
  );
};
