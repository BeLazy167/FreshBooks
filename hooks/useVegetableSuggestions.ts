// hooks/useVegetableSuggestions.ts
import { useState, useCallback, useRef, useEffect } from 'react';

import { useVegetableStore } from '~/app/store/vegetables';
import { Vegetables } from '~/types';

export function useVegetableSuggestions() {
  const { vegetables, loading, error, fetchVegetables } = useVegetableStore();
  const [suggestions, setSuggestions] = useState<Vegetables[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout>();

  // Fetch vegetables on mount if not already loaded
  useEffect(() => {
    if (vegetables.length === 0) {
      fetchVegetables().catch(console.error);
    }
  }, []);

  const filterVegetables = useCallback(
    (query: string) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }

      const filtered = vegetables
        .filter((veg: Vegetables) => veg.name.toLowerCase().includes(query.toLowerCase()))
        .map((veg: Vegetables) => ({
          id: veg.id,
          name: veg.name,
          isAvailable: veg.isAvailable, // Add this line
        }));

      setSuggestions(filtered);
    },
    [vegetables]
  );

  const loadSuggestions = useCallback(
    (query: string) => {
      setSearchQuery(query);

      // Clear previous timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Debounce the filter operation
      debounceTimeout.current = setTimeout(() => {
        filterVegetables(query);
      }, 300);
    },
    [filterVegetables]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return {
    suggestions,
    loading,
    error,
    loadSuggestions,
    clearSuggestions: () => setSuggestions([]),
    searchQuery,
  };
}
