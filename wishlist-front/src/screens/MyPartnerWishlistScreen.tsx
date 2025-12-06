import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { apiGet } from "../api/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { WishlistItem } from "../store/wishlistStore";
import { apiGetPartnerWishlist } from "../api/wishlist";

type Props = NativeStackScreenProps<RootStackParamList, "PartnerWishlist">;

export default function MyPartnerWishlistScreen({ route }: Props) {
  const partnerId  = route.params.partnerId;
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<WishlistItem[]>([]);
  

  useEffect(() => {
    async function load() {
      try {
        const raw = await apiGetPartnerWishlist(partnerId);
        const mapped: WishlistItem[] = raw.map((item: any) => ({
          id: item.id,
          title: item.name ?? "",
          description: item.description ?? "",
          price: item.price ?? 0,
          priority: item.priority ?? "none",
          imageUri: item.imageUrl ?? undefined,
        }));
        //const data = await apiGet(`/api/wishlist/of-user/${partnerId}`);
        setItems(Array.isArray(mapped) ? mapped : []);
      } catch (e) {
        console.log("Fehler beim Laden der Partner-Wishlist", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [partnerId]);


    if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ padding: 20 }}>Lädt...</Text>;
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Friend's Wishlist</Text>

      {items.length === 0 ? (
        <Text style={{ marginTop: 10, fontStyle: "italic" }}>
          Dein Partner hat noch nichts eingetragen.
        </Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 12,
                marginVertical: 8,
                backgroundColor: "#f3f3f3",
                borderRadius: 8,
                borderLeftWidth: 5,
                borderLeftColor:
                  item.priority === "red"
                    ? "#ff4d4f"
                    : item.priority === "blue"
                    ? "#40a9ff"
                    : item.priority === "green"
                    ? "#52c41a"
                    : "#d9d9d9",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.title}
              </Text>

              {item.description && (
                <Text style={{ marginTop: 4 }}>{item.description}</Text>
              )}

              {item.price != null && (
                <Text style={{ marginTop: 4, fontWeight: "600" }}>
                  Preis: {item.price} €
                </Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
