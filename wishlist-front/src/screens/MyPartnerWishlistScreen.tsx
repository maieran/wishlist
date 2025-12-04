import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { apiGet } from "../api/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
type Props = NativeStackScreenProps<RootStackParamList, "PartnerWishlist">;

export default function MyPartnerWishlistScreen({ route } : Props) {
  const { partnerId } = route.params;
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await apiGet(`/api/wishlist/user/${partnerId}`);
      setItems(data);
    }
    load();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Partner Wunschliste</Text>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <Text style={{ padding: 8 }}>{item.title}</Text>
        )}
      />
    </View>
  );
}
