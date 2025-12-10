import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  apiWishlistMy,
  apiWishlistUpdate,
} from "../api/wishlist";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "EditItem">;

export default function EditItemScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [priority, setPriority] =
    useState<"red" | "blue" | "green" | "none">("none");
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const list = await apiWishlistMy();
      const item = list.find((x: { id: number; }) => x.id === id);

      if (!item) {
        Alert.alert("Fehler", "Item nicht gefunden.");
        navigation.goBack();
        return;
      }

      setTitle(item.title);
      setDesc(item.description ?? "");
      setPrice(item.price?.toString() ?? "");
      setPriority(item.priority);
      setImageUri(item.imageUrl);

      setLoading(false);
    }

    load();
  }, [id]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const save = async () => {
    await apiWishlistUpdate(id, {
      title,
      description: desc,
      price: parseFloat(price),
      priority,
      imageUrl: imageUri,
    });

    navigation.goBack();
  };

  if (loading) return <Text style={{ padding: 20 }}>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Item bearbeiten</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        value={desc}
        onChangeText={setDesc}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Button title="Red" onPress={() => setPriority("red")} />
        <Button title="Blue" onPress={() => setPriority("blue")} />
        <Button title="Green" onPress={() => setPriority("green")} />
        <Button title="None" onPress={() => setPriority("none")} />
      </View>

      <Button title="Bild ändern" onPress={pickImage} />

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 150,
            height: 150,
            marginVertical: 10,
            borderRadius: 10,
          }}
        />
      )}

      <Button title="Speichern" onPress={save} />
    </View>
  );
}
