import { create } from "zustand";

interface Product {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  createdAt: string;
  creator: { name: string };
  type: { name: string };
}

interface CartCheckingState {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  setItems: (items: Product[]) => void;
}

const useCartChecking = create<CartCheckingState>((set) => {
  return {
    items: [],
    addItem: (item) => {
      set((state) => {
        const newItems = [...state.items, item];
        localStorage.setItem("check_items", JSON.stringify(newItems));
        return { items: newItems };
      });
    },
    removeItem: (id) => {
      set((state) => {
        const newItems = state.items.filter((item) => item.id !== id);
        localStorage.setItem("check_items", JSON.stringify(newItems));
        return { items: newItems };
      });
    },
    setItems: (items) => {
      set((state) => {
        const isSame = JSON.stringify(state.items) === JSON.stringify(items);
        if (!isSame) {
          localStorage.setItem("check_items", JSON.stringify(items));
          return { items };
        }
        return state; 
      });
    }
  };
});


export default useCartChecking;
