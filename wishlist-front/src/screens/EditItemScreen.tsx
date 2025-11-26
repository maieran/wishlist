import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { loadWishlist, updateWishlistItem } from "../store/wishlistStore";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "EditItem">;

export default function EditItemScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [priority, setPriority] = useState<"red" | "blue" | "green" | "none">("none");
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItem() {
      const list = await loadWishlist();
      const item = list.find((x) => x.id === id);

      if (!item) {
        Alert.alert("Error", "Item not found.");
        navigation.goBack();
        return;
      }

      setTitle(item.title);
      setDesc(item.description);
      setPrice(item.price.toString());
      setPriority(item.priority);
      setImageUri(item.imageUri ?? null);

      setLoading(false);
    }

    fetchItem();
  }, [id]);

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

  const save = async () => {
    const updated = {
      id,
      title,
      description: desc,
      price: parseFloat(price),
      priority,
      imageUri: imageUri ?? undefined,
    };


    await updateWishlistItem(id, updated);

    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Edit Item</Text>

      <Text>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>Description</Text>
      <TextInput
        value={desc}
        onChangeText={setDesc}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>Price</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      <Text>Priority</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Button title="Red" onPress={() => setPriority("red")} />
        <Button title="Blue" onPress={() => setPriority("blue")} />
        <Button title="Green" onPress={() => setPriority("green")} />
        <Button title="None" onPress={() => setPriority("none")} />
      </View>

      <Button title="Change Image" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 150, height: 150, marginVertical: 10, alignSelf: "center" }}
        />
      )}

      <Button title="Save" onPress={save} />
    </View>
  );
}
