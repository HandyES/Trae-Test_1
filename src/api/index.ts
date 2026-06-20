import { ShoppingItem, Restaurant, Entertainment, Medical } from '../types';

const API_BASE_URL = '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T[];
  total: number;
}

// 创建通用 fetch 函数
async function fetchApi<T>(
  endpoint: string, 
  params?: Record<string, string | number>
): Promise<ApiResponse<T>> {
  const url = new URL(endpoint, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// 获取买菜数据
export async function getShoppingData(
  category?: string, 
  limit: number = 20, 
  offset: number = 0
): Promise<ApiResponse<ShoppingItem>> {
  const params: Record<string, string | number> = { limit, offset };
  if (category && category !== 'all') {
    params.category = category;
  }
  return await fetchApi<ShoppingItem>(`${API_BASE_URL}/shopping`, params);
}

// 获取餐厅数据
export async function getRestaurantData(
  limit: number = 20, 
  offset: number = 0
): Promise<ApiResponse<Restaurant>> {
  return await fetchApi<Restaurant>(`${API_BASE_URL}/restaurants`, { limit, offset });
}

// 获取娱乐数据
export async function getEntertainmentData(
  limit: number = 20, 
  offset: number = 0
): Promise<ApiResponse<Entertainment>> {
  return await fetchApi<Entertainment>(`${API_BASE_URL}/entertainment`, { limit, offset });
}

// 获取医疗数据
export async function getMedicalData(
  level?: string, 
  limit: number = 20, 
  offset: number = 0
): Promise<ApiResponse<Medical>> {
  const params: Record<string, string | number> = { limit, offset };
  if (level && level !== 'all') {
    params.level = level;
  }
  return await fetchApi<Medical>(`${API_BASE_URL}/medical`, params);
}

// 健康检查
export async function healthCheck(): Promise<{ success: boolean; message: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return await response.json();
}
