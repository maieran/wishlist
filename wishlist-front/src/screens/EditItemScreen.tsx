import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import { getWishlist, updateWishlistItem, Priority } from '../store/wishlistStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';

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
  const [desc, setDesc] = useState(item.description);
  const [price, setPrice] = useState(item.price.toString());
  const [imageUri, setImageUri] = useState<string | null>(item.imageUri ?? null);
  const [priority, setPriority] = useState<Priority>(item.priority ?? 'none');

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
      priority,
      groupItems: item.groupItems ?? [],
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
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Edit Item</Text>

      <Text>Title</Text>
      <TextInput value={title} onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 8 }}
      />

      <Text>Description</Text>
      <TextInput value={desc} onChangeText={setDesc}
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

      <Button title="Change Image" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 120, height: 120, marginVertical: 10, alignSelf: 'center' }}
        />
      )}

      <Button title="Save" onPress={save} />
    </View>
  );
}
