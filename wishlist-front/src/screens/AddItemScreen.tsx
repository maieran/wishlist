import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { apiWishlistCreate } from "../api/wishlist";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AddItem">;

export default function AddItemScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [priority, setPriority] = useState<"red" | "blue" | "green" | "none">(
    "none"
  );
  const [imageUri, setImageUri] = useState<string | null>(null);

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
    if (!title || !price) {
      Alert.alert("Fehler", "Bitte Titel und Preis eingeben.");
      return;
    }

    await apiWishlistCreate({
      title,
      description: desc,
      price: parseFloat(price),
      priority,
      imageUrl: imageUri ?? null,
    });

    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>Neues Item</Text>

      <TextInput
        placeholder="Titel"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Beschreibung"
        value={desc}
        onChangeText={setDesc}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Preis (€)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Text style={{ marginVertical: 5 }}>Priorität:</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Button title="Red" onPress={() => setPriority("red")} />
        <Button title="Blue" onPress={() => setPriority("blue")} />
        <Button title="Green" onPress={() => setPriority("green")} />
        <Button title="None" onPress={() => setPriority("none")} />
      </View>

      <Button title="Bild auswählen" onPress={pickImage} />
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
