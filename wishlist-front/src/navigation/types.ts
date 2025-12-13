export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Between: undefined;
  Home: undefined;
  Rules: undefined;

  Wishlist: undefined;
  AddItem: undefined;
  EditItem: { id: number };

  Team: undefined;
  TeamCreate: undefined;
  TeamJoin: undefined;
  TeamList: undefined;
  
  MatchingProgress: { teamId: number };
  //MatchingProgress: undefined;
  MyPartner: undefined;
  PartnerWishlist: { partnerId: number };

  AdminUsers: undefined;
  AdminCreateUser: undefined;
  AdminEditUser: { userId: number };

  MatchingDate: undefined;
  AdminDashboard: undefined;
};
