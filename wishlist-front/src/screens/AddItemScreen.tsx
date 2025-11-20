import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert } from 'react-native';
import { addWishlistItem, Priority } from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'AddItem'>;

export default function AddItemScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>('none');

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
    if (!title || !desc || !price) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }

    if (!imageUri) {
      Alert.alert("Image required", "Please pick an image.");
      return;
    }

    addWishlistItem({
      title,
      description: desc,
      price: parseFloat(price),
      imageUri,
      priority,
    });

    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Add Item</Text>

      <Text>Title</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={title}
        onChangeText={setTitle}
      />

      <Text>Description</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={desc}
        onChangeText={setDescription}
      />

      <Text>Price</Text>
      <TextInput
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
        value={price}
        onChangeText={setPrice}
      />

      <Text>Priority</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
        <Button title="Red" onPress={() => setPriority('red')} />
        <Button title="Blue" onPress={() => setPriority('blue')} />
        <Button title="Green" onPress={() => setPriority('green')} />
        <Button title="None" onPress={() => setPriority('none')} />
      </View>

      <Button title="Pick Image" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 150,
            height: 150,
            marginVertical: 10,
            alignSelf: "center",
            borderRadius: 10
          }}
        />
      )}

      <Button title="Save" onPress={save} />
    </View>
  );
}
