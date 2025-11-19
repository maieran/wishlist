import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, Alert } from 'react-native';
import { addWishlistItem, Priority } from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'AddItem'>;

export default function AddItemScreen({ navigation}: Props ) {
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
    if (!imageUri) {
      Alert.alert("Image required", "Please choose an image.");
      return;
    }

    addWishlistItem({
      title,
      description: desc,
      price: parseFloat(price),
      imageUri,
      priority,
      groupItems: [],
    });

    navigation.goBack();
  };

  const priorityButtonStyle = (value: Priority) => ({
    borderWidth: 1,
    borderColor: priority === value ? '#000' : '#ccc',
    padding: 8,
    marginRight: 8,
  });


  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Add Item</Text>

      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8 }}
      />

      <Text>Description</Text>
      <TextInput value={desc} onChangeText={setDescription}
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8 }}
      />

      <Text>Price</Text>
      <TextInput value={price} onChangeText={setPrice} keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8 }}
      />

      <Text style={{ marginTop: 10 }}>Priority</Text>
      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <View style={priorityButtonStyle('red')}>
          <Button title="Red" onPress={() => setPriority('red')} />
        </View>
        <View style={priorityButtonStyle('blue')}>
          <Button title="Blue" onPress={() => setPriority('blue')} />
        </View>
        <View style={priorityButtonStyle('green')}>
          <Button title="Green" onPress={() => setPriority('green')} />
        </View>
        <View style={priorityButtonStyle('none')}>
          <Button title="None" onPress={() => setPriority('none')} />
        </View>
      </View>

      <Button title="Pick Image" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 150, height: 150, marginTop: 20, alignSelf: 'center' }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Save" onPress={save} />
      </View>
    </View>
  );
}
