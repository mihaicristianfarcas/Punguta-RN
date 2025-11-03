import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ShoppingList, ShoppingListItem } from '../types/ShoppingList';
import { generateId } from '../utils/formatters';

interface ListContextType {
  lists: ShoppingList[];
  listItems: ShoppingListItem[];
  addList: (name: string) => ShoppingList;
  updateList: (id: string, updates: Partial<Omit<ShoppingList, 'id' | 'createdAt'>>) => void;
  deleteList: (id: string) => void;
  addProductToList: (listId: string, productId: string) => ShoppingListItem | null;
  removeProductFromList: (listId: string, productId: string) => void;
  toggleProductChecked: (listId: string, productId: string) => void;
  isProductChecked: (listId: string, productId: string) => boolean;
  getListItems: (listId: string) => ShoppingListItem[];
  getListById: (id: string) => ShoppingList | undefined;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export function ListProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [listItems, setListItems] = useState<ShoppingListItem[]>([]);

  const addList = (name: string): ShoppingList => {
    const newList: ShoppingList = {
      id: generateId(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLists((prev) => [...prev, newList]);
    return newList;
  };

  const updateList = (id: string, updates: Partial<Omit<ShoppingList, 'id' | 'createdAt'>>) => {
    setLists((prev) =>
      prev.map((list) => (list.id === id ? { ...list, ...updates, updatedAt: new Date() } : list))
    );
  };

  const deleteList = (id: string) => {
    setLists((prev) => prev.filter((list) => list.id !== id));
    setListItems((prev) => prev.filter((item) => item.shoppingListId !== id));
  };

  const addProductToList = (listId: string, productId: string): ShoppingListItem | null => {
    // Check if product already in list
    const exists = listItems.some(
      (item) => item.shoppingListId === listId && item.productId === productId
    );

    if (exists) {
      return null;
    }

    const newItem: ShoppingListItem = {
      id: generateId(),
      productId,
      shoppingListId: listId,
      isChecked: false,
      addedAt: new Date(),
    };

    setListItems((prev) => [...prev, newItem]);

    // Update list timestamp
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, updatedAt: new Date() } : list))
    );

    return newItem;
  };

  const removeProductFromList = (listId: string, productId: string) => {
    setListItems((prev) =>
      prev.filter((item) => !(item.shoppingListId === listId && item.productId === productId))
    );

    // Update list timestamp
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, updatedAt: new Date() } : list))
    );
  };

  const toggleProductChecked = (listId: string, productId: string) => {
    setListItems((prev) =>
      prev.map((item) =>
        item.shoppingListId === listId && item.productId === productId
          ? { ...item, isChecked: !item.isChecked }
          : item
      )
    );

    // Update list timestamp
    setLists((prev) =>
      prev.map((list) => (list.id === listId ? { ...list, updatedAt: new Date() } : list))
    );
  };

  const isProductChecked = (listId: string, productId: string): boolean => {
    const item = listItems.find(
      (item) => item.shoppingListId === listId && item.productId === productId
    );
    return item?.isChecked || false;
  };

  const getListItems = (listId: string): ShoppingListItem[] => {
    return listItems.filter((item) => item.shoppingListId === listId);
  };

  const getListById = (id: string) => {
    return lists.find((list) => list.id === id);
  };

  return (
    <ListContext.Provider
      value={{
        lists,
        listItems,
        addList,
        updateList,
        deleteList,
        addProductToList,
        removeProductFromList,
        toggleProductChecked,
        isProductChecked,
        getListItems,
        getListById,
      }}>
      {children}
    </ListContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useLists must be used within a ListProvider');
  }
  return context;
}
