import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, ProductQuantity } from '../types/Product';
import { generateId } from '../utils/formatters';

interface ProductContextType {
  products: Product[];
  addProduct: (name: string, quantity: ProductQuantity, categoryId?: string) => Product;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (name: string, quantity: ProductQuantity, categoryId?: string): Product => {
    const newProduct: Product = {
      id: generateId(),
      name,
      quantity,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
