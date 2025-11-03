export interface ProductQuantity {
  amount: number;
  unit: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: ProductQuantity;
  categoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSuggestion {
  name: string;
  suggestedCategoryId: string;
  suggestedUnit: string;
  confidence: number;
}
