import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { addWishlistItem } from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
type Props = NativeStackScreenProps<RootStackParamList, 'AddItem'>;

export default function AddItemScreen({ navigation}: Props ) {
  const [title, setTitle] = useState('');
  const [desc, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const save = () => {
    addWishlistItem({
      title,
      description: desc,
      price: parseFloat(price),
    });

    navigation.goBack();
  };


  return (
    <View style={{ padding: 20 }}>
      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle} />

      <Text>Description</Text>
      <TextInput value={desc} onChangeText={setDescription} />

      <Text>Price</Text>
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Button title="Save" onPress={save} />
    </View>
  );
}
