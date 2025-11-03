import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Store, StoreType, StoreLocation } from '../types/Store';
import { generateId } from '../utils/formatters';
import { STORE_TYPE_DEFAULTS } from '../constants/storeTypes';

interface StoreContextType {
  stores: Store[];
  addStore: (name: string, type: StoreType, location: StoreLocation) => Store;
  updateStore: (id: string, updates: Partial<Omit<Store, 'id'>>) => void;
  deleteStore: (id: string) => void;
  reorderStoreCategories: (storeId: string, newOrder: string[]) => void;
  getStoreById: (id: string) => Store | undefined;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);

  const addStore = (name: string, type: StoreType, location: StoreLocation): Store => {
    const defaultCategories = STORE_TYPE_DEFAULTS[type].categoryIds;

    const newStore: Store = {
      id: generateId(),
      name,
      type,
      location,
      categoryOrder: defaultCategories,
    };

    setStores((prev) => [...prev, newStore]);
    return newStore;
  };

  const updateStore = (id: string, updates: Partial<Omit<Store, 'id'>>) => {
    setStores((prev) => prev.map((store) => (store.id === id ? { ...store, ...updates } : store)));
  };

  const deleteStore = (id: string) => {
    setStores((prev) => prev.filter((store) => store.id !== id));
  };

  const reorderStoreCategories = (storeId: string, newOrder: string[]) => {
    setStores((prev) =>
      prev.map((store) => (store.id === storeId ? { ...store, categoryOrder: newOrder } : store))
    );
  };

  const getStoreById = (id: string) => {
    return stores.find((store) => store.id === id);
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        addStore,
        updateStore,
        deleteStore,
        reorderStoreCategories,
        getStoreById,
      }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStores() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStores must be used within a StoreProvider');
  }
  return context;
}
