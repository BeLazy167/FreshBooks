// This file is intentionally left empty
// utils/index.ts
import * as Crypto from 'expo-crypto';

export const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

export const generateId = () => {
  return Crypto.randomUUID();
};
