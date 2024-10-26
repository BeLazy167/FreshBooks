import { create } from 'zustand';
import type { Vegetables } from '~/types';
import { VegetableAPI } from '~/app/services/api';

interface VegetableStore {
  vegetables: Vegetables[];
  error?: Error | null;
  fetchVegetables: () => Promise<void>;
  createVegetable: (vegetable: Omit<Vegetables, 'id'>) => Promise<void>;
  loading: boolean
}

export const useVegetableStore = create<VegetableStore>((set) => ({
  vegetables: [],
  loading: false,
  error: null,
  fetchVegetables: async () => {
    set({ loading: true, error: null });
    const { data, error } = await VegetableAPI.getAll();
    set({ vegetables: data || [], loading: false });
  },
  createVegetable: async (vegetable: Omit<Vegetables, 'id'>) => {
    set({ loading: true, error: null });
    const { data, error } = await VegetableAPI.create(vegetable);
    if (data) {
      set((state) => ({ vegetables: [...state.vegetables, data as Vegetables] }));
    }
    set({ loading: false });
  },

}));



