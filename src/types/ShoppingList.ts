export interface ShoppingListItem {
  id: string;
  productId: string;
  shoppingListId: string;
  isChecked: boolean;
  addedAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
