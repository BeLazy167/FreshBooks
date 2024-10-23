// This file is intentionally left empty
// types/index.ts
export interface VegetableItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Bill {
  id: string;
  providerName: string;
  providerId: string;
  items: VegetableItem[];
  total: number;
  date: string;
  signer: string;
}

export interface Provider {
  id: string;
  name: string;
  phone?: string;
}
