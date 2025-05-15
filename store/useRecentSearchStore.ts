import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_RECENT_SEARCHES = 10;
const STORAGE_KEY = '@app_recent_searches';

type RecentSearchesState = {
  recentSearches: string[];
  isLoaded: boolean;
  loadRecentSearches: () => Promise<void>;
  addRecentSearch: (term: string) => Promise<void>;
  removeRecentSearch: (term: string) => Promise<void>;
  clearAllRecentSearches: () => Promise<void>;
}

export const useRecentSearchesStore = create<RecentSearchesState>((set, get) => ({
  recentSearches: [],
  isLoaded: false,

  loadRecentSearches: async () => {
    if (get().isLoaded) return;
    try {
      const storedSearches = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedSearches) {
        set({ recentSearches: JSON.parse(storedSearches), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      set({ isLoaded: true }); // Mark as loaded even if error to prevent multiple loads
    }
  },

  addRecentSearch: async (term: string) => {
    const cleanedTerm = term.trim();
    if (!cleanedTerm) return;

    const currentSearches = get().recentSearches;
    // Remove if already exists to move it to the top
    const filteredSearches = currentSearches.filter(s => s.toLowerCase() !== cleanedTerm.toLowerCase());
    
    const newSearches = [cleanedTerm, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);

    set({ recentSearches: newSearches });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  },

  removeRecentSearch: async (term: string) => {
    const newSearches = get().recentSearches.filter(s => s !== term);
    set({ recentSearches: newSearches });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
    } catch (error) {
      console.error('Failed to remove recent search:', error);
    }
  },

  clearAllRecentSearches: async () => {
    set({ recentSearches: [] });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear all recent searches:', error);
    }
  },
}));

// Initialize by loading searches when the store is first used/imported.
// This is a common pattern, but for critical initial data, you might call it in your App.tsx.
useRecentSearchesStore.getState().loadRecentSearches();