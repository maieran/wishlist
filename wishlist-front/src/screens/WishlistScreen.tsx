import React, { useState, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image } from 'react-native';
import { loadWishlist } from "../store/wishlistStore";
import { useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { WishlistItem, getWishlist, deleteWishlistItem } from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';
type Props = NativeStackScreenProps<RootStackParamList, 'Wishlist'>;



export default function WishlistScreen({ navigation }: Props) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const refresh = useCallback(() => {
    setItems(getWishlist());
  }, []);

  useFocusEffect(refresh);

  useEffect(() => {
    loadWishlist().then(refresh);
  }, []);


return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Add Item" onPress={() => navigation.navigate("AddItem")} />

      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditItem", { id: item.id })}
            style={{
              padding: 15,
              marginVertical: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 10,
            }}
          >
            {item.imageUri && (
              <Image
                source={{ uri: item.imageUri }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
            )}
            
            <Text style={{ fontSize: 20 }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={{ fontWeight: "bold" }}>{item.price} EUR</Text>

            <Button
              title="Delete"
              onPress={() => {
                deleteWishlistItem(item.id);
                refresh(); // refresh right after deleting
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
