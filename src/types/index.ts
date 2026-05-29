export type ShoppingCategory = 'vegetable' | 'egg' | 'meat' | 'milk';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ShoppingCategory;
  price: number;
  unit: string;
  market: string;
  updateTime: string;
}

export interface Restaurant {
  id: string;
  name: string;
  namePinyin: string;
  address: string;
  rating: number;
  recommendedDishes: string[];
  avgPrice: number;
  distance?: number;
}

export interface Review {
  id: string;
  userName: string;
  content: string;
  rating: number;
  createTime: string;
}

export interface Entertainment {
  id: string;
  name: string;
  namePinyin: string;
  address: string;
  type: 'entertainment' | 'party';
  price: number;
  distance?: number;
  reviews: Review[];
}

export type MedicalLevel = 'community' | 'district' | 'city';

export interface Medical {
  id: string;
  name: string;
  namePinyin: string;
  address: string;
  level: MedicalLevel;
  distance?: number;
  phone?: string;
}
