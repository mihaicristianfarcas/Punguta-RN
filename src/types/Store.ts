export enum StoreType {
  GROCERY = 'Grocery',
  PHARMACY = 'Pharmacy',
  HARDWARE = 'Hardware',
  HYPERMARKET = 'Hypermarket',
}

export interface StoreLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Store {
  id: string;
  name: string;
  type: StoreType;
  location: StoreLocation;
  categoryOrder: string[];
}
