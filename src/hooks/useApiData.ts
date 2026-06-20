import { useState, useEffect, useCallback } from 'react';
import { getShoppingData, getRestaurantData, getEntertainmentData, getMedicalData } from '../api';
import { shoppingData, restaurantData, entertainmentData, partyData, medicalData } from '../data/mockData';

interface DataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
}

// 购物数据 Hook
export function useShoppingData(category?: string, limit: number = 20) {
  const [state, setState] = useState<DataState<typeof shoppingData[0]>>({
    data: [],
    loading: true,
    error: null,
    hasMore: true,
    total: 0,
  });
  const [offset, setOffset] = useState(0);
  const [loadedFromApi, setLoadedFromApi] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await getShoppingData(category, limit, offset);
      setState({
        data: offset === 0 ? response.data : [...state.data, ...response.data],
        loading: false,
        error: null,
        hasMore: offset + limit < response.total,
        total: response.total,
      });
      setLoadedFromApi(true);
    } catch (error) {
      console.log('Failed to load from API, falling back to mock data', error);
      const fallbackData = category === 'all'
        ? shoppingData
        : shoppingData.filter(item => item.category === category);
      
      const slice = fallbackData.slice(offset, offset + limit);
      
      setState({
        data: offset === 0 ? slice : [...state.data, ...slice],
        loading: false,
        error: 'Failed to load from server, using cached data',
        hasMore: offset + limit < fallbackData.length,
        total: fallbackData.length,
      });
    }
  }, [category, limit, offset]);

  useEffect(() => {
    setOffset(0);
    loadData();
  }, [category]);

  useEffect(() => {
    if (offset > 0) {
      loadData();
    }
  }, [offset]);

  const loadMore = useCallback(() => {
    if (state.hasMore) {
      setOffset(prev => prev + limit);
    }
  }, [state.hasMore]);

  return {
    ...state,
    loadMore,
  };
}

// 餐厅数据 Hook
export function useRestaurantData(limit: number = 20) {
  const [state, setState] = useState<DataState<typeof restaurantData[0]>>({
    data: [],
    loading: true,
    error: null,
    hasMore: true,
    total: 0,
  });
  const [offset, setOffset] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await getRestaurantData(limit, offset);
      setState({
        data: offset === 0 ? response.data : [...state.data, ...response.data],
        loading: false,
        error: null,
        hasMore: offset + limit < response.total,
        total: response.total,
      });
    } catch (error) {
      console.log('Failed to load from API, falling back to mock data', error);
      const fallbackData = restaurantData.slice(offset, offset + limit);
      setState({
        data: offset === 0 ? restaurantData : [...state.data, ...fallbackData],
        loading: false,
        error: 'Failed to load from server, using cached data',
        hasMore: offset + limit < restaurantData.length,
        total: restaurantData.length,
      });
    }
  }, [limit, offset]);

  useEffect(() => {
    loadData();
  }, [offset]);

  const loadMore = useCallback(() => {
    if (state.hasMore) {
      setOffset(prev => prev + limit);
    }
  }, [state.hasMore]);

  return {
    ...state,
    loadMore,
  };
}

// 娱乐数据 Hook
export function useEntertainmentData(limit: number = 20) {
  const [state, setState] = useState<DataState<typeof entertainmentData[0]>>({
    data: [],
    loading: true,
    error: null,
    hasMore: true,
    total: 0,
  });
  const [offset, setOffset] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await getEntertainmentData(limit, offset);
      setState({
        data: offset === 0 ? response.data : [...state.data, ...response.data],
        loading: false,
        error: null,
        hasMore: offset + limit < response.total,
        total: response.total,
      });
    } catch (error) {
      console.log('Failed to load from API, falling back to mock data', error);
      const fallbackData = entertainmentData.slice(offset, offset + limit);
      setState({
        data: offset === 0 ? entertainmentData : [...state.data, ...fallbackData],
        loading: false,
        error: 'Failed to load from server, using cached data',
        hasMore: offset + limit < entertainmentData.length,
        total: entertainmentData.length,
      });
    }
  }, [limit, offset]);

  useEffect(() => {
    loadData();
  }, [offset]);

  const loadMore = useCallback(() => {
    if (state.hasMore) {
      setOffset(prev => prev + limit);
    }
  }, [state.hasMore]);

  return {
    ...state,
    loadMore,
  };
}

// 聚会数据 Hook
export function usePartyData(limit: number = 20) {
  const [state, setState] = useState<DataState<typeof partyData[0]>>({
    data: [],
    loading: true,
    error: null,
    hasMore: true,
    total: 0,
  });
  const [offset, setOffset] = useState(0);

  // 聚会数据暂时使用 mock data，因为后端没有专门的 party 接口
  useEffect(() => {
    setState({
      data: partyData.slice(0, limit),
      loading: false,
      error: null,
      hasMore: partyData.length > limit,
      total: partyData.length,
    });
  }, []);

  const loadMore = useCallback(() => {
    const newOffset = offset + limit;
    const newData = partyData.slice(0, newOffset + limit);
    setState({
      data: newData,
      loading: false,
      error: null,
      hasMore: newOffset + limit < partyData.length,
      total: partyData.length,
    });
    setOffset(newOffset);
  }, [offset]);

  return {
    ...state,
    loadMore,
  };
}

// 医疗数据 Hook
export function useMedicalData(level?: string, limit: number = 20) {
  const [state, setState] = useState<DataState<typeof medicalData[0]>>({
    data: [],
    loading: true,
    error: null,
    hasMore: true,
    total: 0,
  });
  const [offset, setOffset] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await getMedicalData(level, limit, offset);
      setState({
        data: offset === 0 ? response.data : [...state.data, ...response.data],
        loading: false,
        error: null,
        hasMore: offset + limit < response.total,
        total: response.total,
      });
    } catch (error) {
      console.log('Failed to load from API, falling back to mock data', error);
      const fallbackData = level === 'all'
        ? medicalData
        : medicalData.filter(item => item.level === level);
      
      const slice = fallbackData.slice(offset, offset + limit);
      
      setState({
        data: offset === 0 ? slice : [...state.data, ...slice],
        loading: false,
        error: 'Failed to load from server, using cached data',
        hasMore: offset + limit < fallbackData.length,
        total: fallbackData.length,
      });
    }
  }, [level, limit, offset]);

  useEffect(() => {
    setOffset(0);
    loadData();
  }, [level]);

  useEffect(() => {
    if (offset > 0) {
      loadData();
    }
  }, [offset]);

  const loadMore = useCallback(() => {
    if (state.hasMore) {
      setOffset(prev => prev + limit);
    }
  }, [state.hasMore]);

  return {
    ...state,
    loadMore,
  };
}
