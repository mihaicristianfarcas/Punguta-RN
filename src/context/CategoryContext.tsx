import React, { createContext, useContext, ReactNode } from 'react';
import { Category } from '../types/Category';
import { CATEGORIES } from '../constants/categories';

interface CategoryContextType {
  categories: Category[];
  getCategoryById: (id: string) => Category | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const getCategoryById = (id: string) => {
    return CATEGORIES.find(cat => cat.id === id);
  };

  return (
    <CategoryContext.Provider value={{ categories: CATEGORIES, getCategoryById }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
