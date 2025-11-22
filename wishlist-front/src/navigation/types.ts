export type RootStackParamList = {
  Home: undefined;
  Wishlist: undefined;
  AddItem: undefined;
  EditItem: { id: string };

  Team: { teamId: string };
  MatchingProgress: { teamId: string };
  MyPartner: { teamId: string; partnerId: string };
  PartnerWishlist: { partnerId: string };
};
