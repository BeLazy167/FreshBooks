import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FiltersState {
  providerId: string;
  signerId: string;
  startDate: string | null; // Store as ISO string for persistence
  endDate: string | null;
  setFilter: (filter: Partial<Omit<FiltersState, 'setFilter' | 'clearFilters'>>) => void;
  clearFilters: () => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      providerId: '',
      signerId: '',
      startDate: null,
      endDate: null,
      setFilter: (filter) => set((state) => ({ ...state, ...filter })),
      clearFilters: () => 
        set({
          providerId: '',
          signerId: '',
          startDate: null,
          endDate: null,
        }),
    }),
    {
      name: 'bill-filters',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Add default export to satisfy Expo Router
export default function FiltersStore() {
  return null;
} 