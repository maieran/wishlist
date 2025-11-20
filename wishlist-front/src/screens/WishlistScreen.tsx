import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { WishlistItem, getWishlist, deleteWishlistItem, loadWishlist, Priority } from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Wishlist'>;

export default function WishlistScreen({ navigation }: Props) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] =
    useState<
      "priority" 
      | "alphaAsc" 
      | "alphaDesc" 
      | "priceAsc" 
      | "priceDesc" 
      | "none"
    >("priority");

  const refresh = useCallback(() => {
    setItems(getWishlist());
  }, []);

  useFocusEffect(refresh);

  useEffect(() => {
    loadWishlist().then(refresh);
  }, []);

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case 'red':
        return '#ff4d4f';
      case 'blue':
        return '#40a9ff';
      case 'green':
        return '#52c41a';
      default:
        return '#d9d9d9';
    }
  };

  //priceToggle 
  const togglePriceSort = () => {
    if (sortMode === "priceAsc") {
      setSortMode("priceDesc");
    } else if (sortMode === "priceDesc") {
      setSortMode("none");
    } else {
      setSortMode("priceAsc");
    }
  };

  //alphaToggle
  const toggleAlphaSort = () => {
    if (sortMode === "alphaAsc") {
      setSortMode("alphaDesc");
    } else if (sortMode === "alphaDesc") {
      setSortMode("none");
    } else {
      setSortMode("alphaAsc");
    }
  };

  let visibleItems = [...items];

  // Search
  if (search.trim() !== "") {
    visibleItems = visibleItems.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Sorting
  //priority 
  if (sortMode === "priority") {
    const order = { red: 1, blue: 2, green: 3, none: 4 };
    visibleItems.sort((a, b) => order[a.priority!] - order[b.priority!]);
  }
  //alphabetical asceding
  if (sortMode === "alphaAsc") {
    visibleItems.sort((a, b) => a.title.localeCompare(b.title));
  }

  //alphabetical descending
  if (sortMode === "alphaDesc") {
    visibleItems.sort((a, b) => b.title.localeCompare(a.title));
  }


  //price ascending
  if (sortMode === "priceAsc") {
    visibleItems.sort((a, b) => a.price - b.price);
  }
  //price descending
  if (sortMode === "priceDesc") {
    visibleItems.sort((a, b) => b.price - a.price);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>

      {/*Search Input */}
      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginBottom: 10,
        }}
      />

      {/* Sorting Buttons */}
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View style={{ marginRight: 8 }}>
          <Button title="Priority" onPress={() => setSortMode("priority")} />
        </View>
        <View style={{ marginRight: 8 }}>
          <Button title="A–Z ↕" onPress={toggleAlphaSort} />
        </View>
        <View style={{ marginRight: 8 }}>
          <Button title="Price ↕" onPress={togglePriceSort} />
        </View>
        <View>
          <Button title="None" onPress={() => setSortMode("none")} />
        </View>
      </View>

      {/* Add Item */}
      <Button title="Add Item" onPress={() => navigation.navigate("AddItem")} />

      {/* WishList */}
      <FlatList
        data={visibleItems}       // 👈 IMPORTANT: visibleItems, NOT items
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditItem", { id: item.id })}
            style={{
              padding: 15,
              marginVertical: 10,
              backgroundColor: "#fdfdfd",
              borderRadius: 10,
              borderWidth: 3,
              borderColor: getPriorityColor(item.priority),
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
                refresh();
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
