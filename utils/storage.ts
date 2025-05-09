// utils/storage.ts
export const STORAGE_KEY = 'check.items';

export function getStoredItems(): any[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function setStoredItems(items: any[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function clearStoredItems() {
    localStorage.removeItem(STORAGE_KEY);
}
