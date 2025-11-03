export interface Category {
  id: string;
  name: string;
  keywords: string[];
  defaultUnit?: string;
  icon: string;
  color: string;
}

export interface CategoryVisual {
  icon: string;
  color: string;
}
