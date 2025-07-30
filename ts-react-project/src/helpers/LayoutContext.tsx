import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const LayoutContext = createContext<{
  layout: LayoutType;
  sortBy: { type: SortByType; direction: 'asc' | 'desc' };
  pickedTags: string[];
  setLayout: (layout: LayoutType) => void;
  setSortBy: (sortBy: { type: SortByType; direction: 'asc' | 'desc' }) => void;
  setPickedTags: (tags: string[]) => void;
} | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export enum LayoutType {
  DEF = 'shop-page',
  FIR = 'first-layout',
  SEC = 'second-layout'
}

export enum SortByType {
  PRICE = 'price',
  ALPHA = 'alphabet',
  TREND = 'trend'
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [layout, setLayout] = useState<LayoutType>(() => {
    const savedLayout = sessionStorage.getItem('layout');
    return savedLayout ? (savedLayout as LayoutType) : LayoutType.DEF;
  });
  
  const [sortBy, setSortBy] = useState<{ type: SortByType; direction: 'asc' | 'desc' }>(() => {
    const savedSortBy = sessionStorage.getItem('sortBy');
    return savedSortBy ? JSON.parse(savedSortBy) : { type: SortByType.PRICE, direction: 'asc' };
  });
  
  const [pickedTags, setPickedTags] = useState<string[]>(() => {
    const savedTags = sessionStorage.getItem('pickedTags');
    return savedTags ? JSON.parse(savedTags) : [];
  });

  useEffect(() => {
    sessionStorage.setItem('layout', layout);
  }, [layout]);

  useEffect(() => {
    sessionStorage.setItem('sortBy', JSON.stringify(sortBy));
  }, [sortBy]);

  useEffect(() => {
    sessionStorage.setItem('pickedTags', JSON.stringify(pickedTags));
  }, [pickedTags]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout, sortBy, setSortBy, pickedTags, setPickedTags }}>
      {children}
    </LayoutContext.Provider>
  );
};