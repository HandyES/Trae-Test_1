export type ShoppingCategory = 'vegetable' | 'egg' | 'meat' | 'milk';

export interface MarketPrice {
  market: string;
  price: number;
  updateTime: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: ShoppingCategory;
  unit: string;
  markets: MarketPrice[];
}

export interface Dish {
  name: string;
  price: number;
}

export interface Restaurant {
  id: string;
  name: string;
  namePinyin: string;
  address: string;
  rating: number;
  recommendedDishes: string[];
  dishes: Dish[];
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
