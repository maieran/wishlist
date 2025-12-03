export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Home: undefined;
  Wishlist: undefined;
  AddItem: undefined;
  EditItem: { id: string };

  Team: { teamId: string };
  MatchingProgress: { teamId: string };
  MyPartner: { teamId: string; partnerId: string };
  PartnerWishlist: { partnerId: string };

  AdminUsers: undefined;
  AdminCreateUser: undefined;
  AdminEditUser: { userId: number };

};
