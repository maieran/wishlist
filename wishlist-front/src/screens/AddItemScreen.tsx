import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert } from 'react-native';
import { addWishlistItem } from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'AddItem'>;

export default function AddItemScreen({ navigation}: Props ) {
  const [title, setTitle] = useState('');
  const [desc, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

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
    if (!imageUri) {
      Alert.alert("Image required", "Please choose an image.");
      return;
    }

    addWishlistItem({
      title,
      description: desc,
      price: parseFloat(price),
      imageUri,
      priority: "none",          // NEW
      groupItems: [],            // NEW
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

      <Button title="Pick Image" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 150, height: 150, marginTop: 20 }}
        />
      )}

      <Button title="Save" onPress={save} />
    </View>
  );
}
