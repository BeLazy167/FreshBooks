import { create } from 'zustand';

import { SignerAPI } from '~/app/services/api';
import type { CreateSignerDTO, Signer } from '~/types';

interface SignerStore {
  signers: Signer[];
  error?: Error | null;
  fetchSigners: () => Promise<void>;
  createSigner: (signer: CreateSignerDTO) => Promise<void>;
  loading: boolean;
}

export const useSignerStore = create<SignerStore>((set) => ({
  signers: [],
  loading: false,
  error: null,
  fetchSigners: async () => {
    set({ loading: true, error: null });
    const { data, error } = await SignerAPI.getAll();
    if (data) {
      set({ signers: data as Signer[] });
    }
    set({ loading: false });
  },
  createSigner: async (signer: CreateSignerDTO) => {
    set({ loading: true, error: null });
    const { data, error } = await SignerAPI.create(signer);
    if (data) {
      set((state) => ({ signers: [...state.signers, data as Signer] }));
    }
    set({ loading: false });
    if (error) {
      throw new Error(error);
    }
  },
}));
