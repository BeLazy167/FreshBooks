// This file is intentionally left empty
// utils/index.ts
import * as Crypto from 'expo-crypto';

export const formatCurrency = (amount: string) => {
  return `$${amount}`;
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

export const generateId = () => {
  return Crypto.randomUUID();
};
