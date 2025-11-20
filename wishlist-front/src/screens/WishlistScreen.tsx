import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  WishlistItem,
  getWishlist,
  deleteWishlistItem,
  loadWishlist,
  Priority,
} from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Wishlist'>;

export default function WishlistScreen({ navigation }: Props) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<
    'priority' | 'alphaAsc' | 'alphaDesc' | 'priceAsc' | 'priceDesc' | 'none'
  >('priority');

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

  // SEARCH
  let visibleItems = [...items];

  if (search.trim() !== '') {
    visibleItems = visibleItems.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  // SORTING
  if (sortMode === 'priority') {
    const order = { red: 1, blue: 2, green: 3, none: 4 };
    visibleItems.sort((a, b) => order[a.priority] - order[b.priority]);
  }

  if (sortMode === 'alphaAsc') {
    visibleItems.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortMode === 'alphaDesc') {
    visibleItems.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (sortMode === 'priceAsc') {
    visibleItems.sort((a, b) => a.price - b.price);
  }

  if (sortMode === 'priceDesc') {
    visibleItems.sort((a, b) => b.price - a.price);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>

      {/* SEARCH */}
      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginBottom: 10,
        }}
      />

      {/* SORT BUTTONS */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
        <View style={{ marginRight: 8, marginBottom: 8 }}>
          <Button title="Priority" onPress={() => setSortMode('priority')} />
        </View>

        <View style={{ marginRight: 8, marginBottom: 8 }}>
          <Button
            title="A–Z ↕"
            onPress={() => {
              if (sortMode === 'alphaAsc') setSortMode('alphaDesc');
              else if (sortMode === 'alphaDesc') setSortMode('none');
              else setSortMode('alphaAsc');
            }}
          />
        </View>

        <View style={{ marginRight: 8, marginBottom: 8 }}>
          <Button
            title="Price ↕"
            onPress={() => {
              if (sortMode === 'priceAsc') setSortMode('priceDesc');
              else if (sortMode === 'priceDesc') setSortMode('none');
              else setSortMode('priceAsc');
            }}
          />
        </View>

        <View style={{ marginRight: 8, marginBottom: 8 }}>
          <Button title="None" onPress={() => setSortMode('none')} />
        </View>
      </View>

      {/* ADD ITEM */}
      <Button title="Add Item" onPress={() => navigation.navigate('AddItem')} />

      {/* FLAT LIST — BASIC, CLEAN */}
      <FlatList
        style={{ marginTop: 10 }}
        data={visibleItems}
        keyExtractor={(x) => x.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditItem', { id: item.id })}
            style={{
              padding: 15,
              marginVertical: 10,
              backgroundColor: '#fdfdfd',
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
            <Text style={{ fontWeight: 'bold' }}>{item.price} EUR</Text>

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
