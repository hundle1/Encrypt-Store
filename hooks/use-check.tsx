import { create } from 'zustand';

interface CheckState {
  items: any[];
  addToCheck: (item: any) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  loadFromStorage: () => void;
}

const useCartChecking = create<CheckState>((set) => ({
  items: [],
  addToCheck: (item) =>
    set((state) => {
      const updatedItems = [...state.items, item];
      localStorage.setItem('checkItems', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }),
  removeItem: (id) =>
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== id);
      localStorage.setItem('checkItems', JSON.stringify(updatedItems));
      return { items: updatedItems };
    }),
  removeAll: () => {
    localStorage.removeItem('checkItems');
    return { items: [] };
  },
  loadFromStorage: () => {
    const storedItems = localStorage.getItem('checkItems');
    if (storedItems) {
      set({ items: JSON.parse(storedItems) });
    }
  },
}));

export default useCartChecking;
