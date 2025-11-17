import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { getWishlist, updateWishlistItem } from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditItem'>;

export default function EditItemScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const item = getWishlist().find((x) => x.id === id);

  if (!item) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Item not found</Text>
      </View>
    );
  }

  const [title, setTitle] = useState(item.title);
  const [desc, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price.toString());

  const save = () => {
    updateWishlistItem(id, {
      id,
      title,
      description: desc,
      price: parseFloat(price),
    });

    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Edit Item</Text>

      <TextInput value={title} onChangeText={setTitle} />
      <TextInput value={desc} onChangeText={setDescription} />
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Button title="Save" onPress={save} />
    </View>
  );
}
