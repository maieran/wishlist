export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Home: undefined;

  Wishlist: undefined;
  AddItem: undefined;
  EditItem: { id: string };

  Team: undefined;                   // simplified
  MatchingProgress: undefined;       // no params needed anymore
  MyPartner: undefined;              // FIXED
  PartnerWishlist: { partnerId: number };

  AdminUsers: undefined;
  AdminCreateUser: undefined;
  AdminEditUser: { userId: number };
  MatchingDate: undefined;
  AdminDashboard: undefined;
};
