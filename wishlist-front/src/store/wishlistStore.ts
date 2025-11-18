
/* In-Memory List that is going to be replaced with the backend API (spring boot) */
/* UI testing */
export type WishlistItem = {
    id: string;
    title: string;
    description: string;
    price: number;
};

let wishlist: WishlistItem[] = [];
let nextId = 1;

//GET /api/wishlist
export const getWishlist = () => [...wishlist]; //returns a new array

//POST /api/wishlist/wishlistitem (id wird intern kreiert später, derzeit nur inkrementiert für UI-Testzwecke)
export const addWishlistItem = (item: Omit<WishlistItem, 'id'>) => {
  const newItem = { ...item, id: String(nextId++) };
  //wishlist.push(newItem);
  wishlist = [...wishlist, newItem];
};



//PUT /api/wishlist/wishlistitem{id="123"}
export const updateWishlistItem = (id:string, updated: WishlistItem) => {
    wishlist = wishlist.map(item => (item.id === id ? updated: item));
}

//DELETE /api/wishlist/wishlistitem{id="123"}
export const deleteWishlistItem = (id: string) => {
    wishlist = wishlist.filter(item => item.id !== id);
}