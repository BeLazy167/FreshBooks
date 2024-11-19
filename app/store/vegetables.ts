import { create } from 'zustand';

import { VegetableAPI } from '~/app/services/api';
import type { Vegetables } from '~/types';

interface VegetableStore {
  vegetables: Vegetables[];
  error?: Error | null;
  fetchVegetables: () => Promise<void>;
  createVegetable: (vegetable: Omit<Vegetables, 'id'>) => Promise<void>;
  loading: boolean;
}

export const useVegetableStore = create<VegetableStore>((set) => ({
  vegetables: [],
  loading: false,
  error: null,
  fetchVegetables: async () => {
    set({ loading: true, error: null });
    const { data, error } = await VegetableAPI.getAll();
    if (data) {
      set({ vegetables: data as Vegetables[] });
    }
    set({ loading: false });
    if (error) {
      throw new Error(error);
    }
  },
  createVegetable: async (vegetable: Omit<Vegetables, 'id'>) => {
    set({ loading: true, error: null });
    const { data, error } = await VegetableAPI.create(vegetable);
    if (data) {
      set((state) => ({ vegetables: [...state.vegetables, data as Vegetables] }));
    }
    set({ loading: false });
    if (error) {
      throw new Error(error);
    }
  },
}));

export default function VegetablesStore() {
  return null;
}
