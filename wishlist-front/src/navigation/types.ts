export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Home: undefined;

  Wishlist: undefined;
  AddItem: undefined;
  EditItem: { id: string };

  Team: undefined;
  TeamCreate: undefined;
  TeamJoin: undefined;

  MatchingProgress: { teamId: number };
  MyPartner: undefined;
  PartnerWishlist: { partnerId: number };

  AdminUsers: undefined;
  AdminCreateUser: undefined;
  AdminEditUser: { userId: number };

  MatchingDate: undefined;
  AdminDashboard: undefined;
};
