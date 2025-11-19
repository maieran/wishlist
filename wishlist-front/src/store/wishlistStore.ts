
/* In-Memory List that is going to be replaced with the backend API (spring boot) */
/* UI testing */
/* Persistent Wishlist Store (with AsyncStorage + Priority) */
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Priority = 'red' | 'blue' | 'green' | 'none';

export type WishlistItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUri?: string;
  priority: Priority;     
  groupItems?: string[];  // later for grouping
};

let wishlist: WishlistItem[] = [];
let nextId = 1;

const STORAGE_KEY = "wishlist-data";

export const loadWishlist = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      const parsed: any[] = JSON.parse(json);

      // Normalize existing data (in case older items have no priority / groupItems)
      wishlist = parsed.map((item, index) => ({
        id: String(item.id ?? index + 1),
        title: item.title ?? "",
        description: item.description ?? "",
        price: typeof item.price === "number" ? item.price : Number(item.price) || 0,
        imageUri: item.imageUri,
        priority: item.priority ?? 'none',
        groupItems: item.groupItems ?? [],
      }));

      nextId = wishlist.length
        ? Math.max(...wishlist.map(i => Number(i.id) || 0)) + 1
        : 1;
    }
  } catch (err) {
    console.log("Error loading wishlist", err);
  }
};

const persistWishlist = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  } catch (err) {
    console.log("Error saving wishlist", err);
  }
};

// GET
export const getWishlist = () => [...wishlist];

// ADD
export const addWishlistItem = (item: Omit<WishlistItem, 'id'>) => {
  const newItem: WishlistItem = {
    ...item,
    id: String(nextId++),
    priority: item.priority ?? 'none',
    groupItems: item.groupItems ?? [],
  };

  wishlist = [...wishlist, newItem];
  persistWishlist();
};

// UPDATE
export const updateWishlistItem = (id: string, updated: WishlistItem) => {
  wishlist = wishlist.map((item) => (item.id === id ? updated : item));
  persistWishlist();
};

// DELETE
export const deleteWishlistItem = (id: string) => {
  wishlist = wishlist.filter((item) => item.id !== id);
  persistWishlist();
};
