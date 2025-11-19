import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import { getWishlist, updateWishlistItem } from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';
type Props = NativeStackScreenProps<RootStackParamList, 'EditItem'>;

export default function EditItemScreen({ route, navigation }: any) {
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
  const [desc, setDesc] = useState(item.description);
  const [price, setPrice] = useState(item.price.toString());
  const [imageUri, setImageUri] = useState<string | null>(item.imageUri ?? null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const save = () => {
    updateWishlistItem(id, {
      id,
      title,
      description: desc,
      price: parseFloat(price),
      imageUri: imageUri ?? undefined,
    });

    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Edit Item</Text>

      <TextInput value={title} onChangeText={setTitle} />
      <TextInput value={desc} onChangeText={setDesc} />
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Button title="Change Image" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 120, height: 120, marginVertical: 10 }}
        />
      )}

      <Button title="Save" onPress={save} />
    </View>
  );
}
