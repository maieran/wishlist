import React from "react";
import { View, Text } from "react-native";

export default function PartnerWishlistScreen() {
  const wishlist = [
    { id: "w1", title: "PS5 Controller", price: 69 },
    { id: "w2", title: "Nike Socks", price: 18 },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 28, marginBottom: 20 }}>
        Partner Wishlist 🎄
      </Text>

      {wishlist.map((item) => (
        <View
          key={item.id}
          style={{
            padding: 15,
            backgroundColor: "#f3f3f3",
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
          <Text>{item.price} €</Text>
        </View>
      ))}
    </View>
  );
}
