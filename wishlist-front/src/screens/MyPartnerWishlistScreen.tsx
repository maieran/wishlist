import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import { apiGet } from "../api/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { getPriorityColor } from "../utils/getPriorityColor";

type Props = NativeStackScreenProps<RootStackParamList, "PartnerWishlist">;

type WishlistItem = {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  priority: "red" | "green" | "blue" | "none";
};

export default function MyPartnerWishlistScreen({ route }: Props) {
  const { partnerId } = route.params;
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    async function load() {
      const data = await apiGet(`/api/wishlist/user/${partnerId}`);
      console.log("Received wishlist:", data);
      setItems(data);
    }
    load();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10, fontWeight: "bold" }}>
        Partner Wunschliste
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const borderColor = getPriorityColor(item.priority);

          return (
            <View
              style={{
                padding: 12,
                marginVertical: 8,
                borderRadius: 10,
                borderWidth: 3,
                borderColor: borderColor,
                backgroundColor: "white",
              }}
            >
              {/* Optionales Bild */}
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: "100%",
                    height: 150,
                    borderRadius: 10,
                    marginBottom: 10,
                  }}
                  resizeMode="cover"
                />
              ) : null}

              {/* Titel */}
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                {item.title}
              </Text>

              {/* Beschreibung */}
              {item.description ? (
                <Text style={{ color: "gray", marginTop: 4 }}>
                  {item.description}
                </Text>
              ) : null}

              {/* Preis */}
              {item.price ? (
                <Text style={{ marginTop: 6, fontWeight: "bold" }}>
                  💶 {item.price.toFixed(2)} €
                </Text>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}
