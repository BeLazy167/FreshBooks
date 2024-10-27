import { Bill, CreateProviderDTO, Provider, Vegetables } from '~/types';

// services/api.ts
const API_URL = 'https://freshbooksbackend.onrender.com/api';
// const API_URL = 'http://localhost:3000/api';

// Helper function for API calls
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error: 'Something went wrong' };
  }
}

export const BillAPI = {
  async getAll() {
    return fetchAPI<Bill[]>('/bills');
  },

  async getById(id: string) {
    return fetchAPI<Bill>(`/bills/${id}`);
  },

  async create(bill: Omit<Bill, 'id' | 'date'>) {
    return fetchAPI<Bill>('/bills', {
      method: 'POST',
      body: JSON.stringify(bill),
    });
  },

  async update(id: string, updates: Partial<Omit<Bill, 'id'>>) {
    return fetchAPI<Bill>(`/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

export const ProviderAPI = {
  async getAll() {
    return fetchAPI<Provider[]>('/providers', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
  },

  async getById(id: string) {
    return fetchAPI<Provider>(`/providers/${id}`);
  },

  async create(provider: CreateProviderDTO) {
    return fetchAPI<Provider>('/providers', {
      method: 'POST',
      body: JSON.stringify(provider),
    });
  },

  async update(id: string, updates: Partial<Omit<Provider, 'id'>>) {
    return fetchAPI<Provider>(`/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

export const VegetableAPI = {
  async getAll() {
    return fetchAPI<Vegetables[]>('/vegetables');
  },

  async create(vegetable: Omit<Vegetables, 'id'>) {
    return fetchAPI<Vegetables>('/vegetables', {
      method: 'POST',
      body: JSON.stringify(vegetable),
    });
  },
};
