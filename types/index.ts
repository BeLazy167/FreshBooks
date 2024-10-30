// // types/index.ts
// export interface VegetableItem {
//   id: string;
//   name: string;
//   quantity: number;
//   price: number;
// }

// export interface Bill {
//   id: string;
//   providerName: string;
//   providerId: string;
//   items: VegetableItem[];
//   total: number;
//   date: string;
//   signer: string;
// }

// export interface Provider {
//   id: string;
//   name: string;
//   phone?: string;
// }

/**
 * Base types for API responses
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ValidationError {
  error: 'Validation error';
  details: {
    code: string;
    message: string;
    path: string[];
  }[];
}

/**
 * Vegetable related types
 */
export interface VegetableItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  item_total?: number;
  isAvailable?: boolean;
}
export interface Vegetables {
  id: string;
  name: string;
  isAvailable: boolean;
}

/**
 * Bill related types
 */
export interface Bill {
  id: string;
  providerId: string;
  providerName: string;
  items: VegetableItem[];
  signer: string;
  total: number;
  created_at: Date;
  date: Date;
}

export interface CreateBillDTO {
  providerId: string;
  providerName: string;
  items: VegetableItem[];
  total: number;
  signer: string;
  date: Date;
}

/**
 * Provider related types
 */
export interface Provider {
  id: string;
  name: string;
  mobile: string;
  address: string;
  created_at: string;
}

export interface CreateProviderDTO {
  name: string;
  mobile: string;
  address: string;
}

/**
 * Vegetable database record type
 */
export interface VegetableRecord {
  id: string;
  name: string;
  isAvailable: boolean;
  created_at: string;
}

/**
 * Signer related types
 */
export interface Signer {
  id: string;
  name: string;
}

export interface CreateSignerDTO {
  name: string;
}

/**
 * API endpoints type for type-safe API calls
 */
export const API_ENDPOINTS = {
  BILLS: '/api/bills',
  BILL_BY_ID: (id: string) => `/api/bills/${id}`,
  PROVIDERS: '/api/providers',
  VEGETABLES: '/api/vegetables',
} as const;

/**
 * Request types for API calls
 */
export interface APIRequestTypes {
  'GET /api/bills': never;
  'GET /api/bills/:id': { id: string };
  'POST /api/bills': CreateBillDTO;
  'GET /api/providers': never;
  'POST /api/providers': CreateProviderDTO;
  'GET /api/vegetables': never;
}

/**
 * Response types for API calls
 */
export interface APIResponseTypes {
  'GET /api/bills': Bill[];
  'GET /api/bills/:id': Bill;
  'POST /api/bills': Bill;
  'GET /api/providers': Provider[];
  'POST /api/providers': Provider;
  'GET /api/vegetables': VegetableRecord[];
}

/**
 * Type-safe API client example usage:
 */
export type APIClient = {
  [K in keyof APIRequestTypes]: (params: APIRequestTypes[K]) => Promise<APIResponseTypes[K]>;
};
