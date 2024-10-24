// store/providers.ts
import { create } from 'zustand';
import type { Provider } from '~/types';
import { ProviderAPI } from '~/app/services/api';

interface ProviderStore {
  providers: Provider[];
  loading: boolean;
  error: string | null;
  fetchProviders: () => Promise<void>;
  createProvider: (provider: Omit<Provider, 'id'>) => Promise<void>;
  getProviderById: (id: string) => Promise<Provider | undefined>;
}

export const useProviderStore = create<ProviderStore>((set, get) => ({
  providers: [],
  loading: false,
  error: null,

  fetchProviders: async () => {
    set({ loading: true, error: null });
    const { data, error } = await ProviderAPI.getAll();
    set({ providers: data || [], loading: false, error });
  },

  createProvider: async (provider) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await ProviderAPI.create(provider);
      if (error) {
        throw new Error(error);
      }
      if (data) {
        set(state => ({
          providers: [...state.providers, data],
          loading: false
        }));
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create provider', loading: false });
      throw error;
    }
  },

  getProviderById: async (id) => {
    const cachedProvider = get().providers.find(p => p.id === id);
    if (cachedProvider) return cachedProvider;

    try {
      const { data, error } = await ProviderAPI.getById(id);
      if (error) {
        throw new Error(error);
      }
      if (data) {
        return data;
      } else {
        throw new Error('Provider not found');
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch provider' });
      return undefined;
    }
  },
}));
