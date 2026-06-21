import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IconStore {
  favorites: string[];
  recent: string[];
  
  toggleFavorite: (iconName: string) => void;
  addToRecent: (iconName: string) => void;
  isFavorite: (iconName: string) => boolean;
}

const MAX_RECENT = 12;

export const useIconStore = create<IconStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      recent: [],

      toggleFavorite: (iconName) => {
        set((state) => ({
          favorites: state.favorites.includes(iconName)
            ? state.favorites.filter((name) => name !== iconName)
            : [...state.favorites, iconName],
        }));
      },

      addToRecent: (iconName) => {
        set((state) => {
          const filtered = state.recent.filter((name) => name !== iconName);
          return {
            recent: [iconName, ...filtered].slice(0, MAX_RECENT),
          };
        });
      },

      isFavorite: (iconName) => get().favorites.includes(iconName),
    }),
    {
      name: 'soap-label-icons',
      partialize: (state) => ({
        favorites: state.favorites,
        recent: state.recent,
      }),
    }
  )
);
