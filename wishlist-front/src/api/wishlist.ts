import { apiGet } from "./api";

export async function apiGetPartnerWishlist(partnerId: number) {
  return apiGet(`/api/wishlist/of-user/${partnerId}`);
}

