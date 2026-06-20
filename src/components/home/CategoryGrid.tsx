import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBasket, Stethoscope, UtensilsCrossed, Gamepad2 } from 'lucide-react';

const categories = [
  {
    id: 'shopping',
    title: '买菜',
    icon: ShoppingBasket,
    color: 'bg-green-500',
    path: '/shopping',
    description: '当日菜蛋肉奶批发价',
  },
  {
    id: 'medical',
    title: '就医',
    icon: Stethoscope,
    color: 'bg-red-500',
    path: '/medical',
    description: '周边医疗地点',
  },
  {
    id: 'dining',
    title: '餐饮',
    icon: UtensilsCrossed,
    color: 'bg-orange-500',
    path: '/dining',
    description: '本地人推荐餐厅',
  },
  {
    id: 'entertainment',
    title: '娱乐',
    icon: Gamepad2,
    color: 'bg-blue-500',
    path: '/entertainment',
    description: '周边玩乐地点',
  },
];

export const CategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">便民服务</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md active:shadow-sm transition-all min-h-[160px] flex flex-col items-center justify-center gap-3"
            >
              <div className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
