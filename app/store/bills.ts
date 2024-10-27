// store/bills.ts
import { create } from 'zustand';
import type { Bill } from '~/types';
import { BillAPI } from '~/app/services/api';

export interface BillStore {
  bills: Bill[];
  loading: boolean;
  error: string | null;
  fetchBills: () => Promise<void>;
  createBill: (bill: Bill) => Promise<void>;
  getBillById: (id: string) => Promise<Bill | undefined>;
  updateBill: (id: string, updates: Partial<Omit<Bill, 'id'>>) => Promise<void>;
  refetchAndReset: () => void;
}

export const useBillStore = create<BillStore>((set, get) => ({
  bills: [],
  loading: false,
  error: null,

  fetchBills: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await BillAPI.getAll();
      if (error) throw new Error(error);
      set({ bills: data ?? [], loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch bills', loading: false });
    }
  },

  createBill: async (bill) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await BillAPI.create(bill);
      if (error) throw new Error(error);
      set((state) => ({
        bills: data ? [data, ...state.bills] : state.bills,
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create bill', loading: false });
      throw error;
    }
  },

  getBillById: async (id): Promise<Bill | undefined> => {
    // First try to find in local state
    const cachedBill = get().bills.find((b) => b.id === id);
    if (cachedBill) return cachedBill;

    // If not found, fetch from API
    try {
      const { data } = await BillAPI.getById(id);
      return data || undefined;
    } catch (error) {
      set({ error: 'Failed to fetch bill' });
      return undefined;
    }
  },

  updateBill: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await BillAPI.update(id, updates);
      if (error) throw new Error(error);
      set((state) => ({
        bills: state.bills.map((b) => (b.id === id ? { ...b, ...data } : b)),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update bill', loading: false });
      throw error;
    }
  },
  refetchAndReset: () => {
    set({ bills: [], loading: false, error: null });
    get().fetchBills();
  },
}));
