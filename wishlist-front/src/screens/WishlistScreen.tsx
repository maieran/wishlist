import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  apiWishlistMy,
  apiWishlistDelete,
} from "../api/wishlist";

import { apiTeamList } from "../api/team";
import { apiMatchingConfig } from "../api/matching";

type Props = NativeStackScreenProps<RootStackParamList, "Wishlist">;

type WishlistItem = {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  priority: "red" | "blue" | "green" | "none";
  imageUrl: string | null;
};

export default function WishlistScreen({ navigation }: Props) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<
    "priority" | "alphaAsc" | "alphaDesc" | "priceAsc" | "priceDesc" | "none"
  >("priority");

  const [teamId, setTeamId] = useState<number | null>(null);
  const [matchingExecuted, setMatchingExecuted] = useState(false);

  // ----------------------------
  // Wishlist laden (Backend)
  // ----------------------------
  const loadWishlist = useCallback(async () => {
    try {
      const data = await apiWishlistMy();
      setItems(data);
    } catch (e) {
      console.log("Wishlist load error:", e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, [loadWishlist])
  );

  useEffect(() => {
    loadWishlist();
  }, []);

  // ----------------------------
  // Team + Matching Status laden
  // ----------------------------
  useEffect(() => {
    async function loadTeam() {
      const team = await apiTeamList();
      const active = team.activeTeamId;

      if (!active) {
        setTeamId(null);
        setMatchingExecuted(false);
        return;
      }

      setTeamId(active);

      const cfg = await apiMatchingConfig();
      setMatchingExecuted(!!cfg.executed);
    }

    loadTeam();
  }, []);

  // ----------------------------
  // Helper Farben
  // ----------------------------
  const getPriorityColor = (p: string) => {
    switch (p) {
      case "red":
        return "#ff4d4f";
      case "blue":
        return "#40a9ff";
      case "green":
        return "#52c41a";
      default:
        return "#cccccc";
    }
  };

  // ----------------------------
  // Filtern + Sortieren
  // ----------------------------
  let visible = [...items];

  if (search.trim() !== "") {
    visible = visible.filter((x) =>
      x.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (sortMode === "priority") {
    const order = { red: 1, blue: 2, green: 3, none: 4 };
    visible.sort((a, b) => order[a.priority] - order[b.priority]);
  }

  if (sortMode === "alphaAsc") visible.sort((a, b) => a.title.localeCompare(b.title));
  if (sortMode === "alphaDesc") visible.sort((a, b) => b.title.localeCompare(a.title));
  if (sortMode === "priceAsc") visible.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  if (sortMode === "priceDesc") visible.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 15,
        }}
      />

      {/* Sortierung */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 15 }}>
        <Button title="Priority" onPress={() => setSortMode("priority")} />
        <View style={{ width: 10 }} />
        <Button
          title="A–Z"
          onPress={() =>
            setSortMode(sortMode === "alphaAsc" ? "alphaDesc" : "alphaAsc")
          }
        />
        <View style={{ width: 10 }} />
        <Button
          title="Price"
          onPress={() =>
            setSortMode(sortMode === "priceAsc" ? "priceDesc" : "priceAsc")
          }
        />
        <View style={{ width: 10 }} />
        <Button title="None" onPress={() => setSortMode("none")} />
      </View>

      <Button title="➕ Add Item" onPress={() => navigation.navigate("AddItem")} />

      {/* Wishlist Items */}
      <FlatList
        style={{ marginTop: 10 }}
        data={visible}
        keyExtractor={(x) => x.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditItem", { id: item.id })}
            style={{
              padding: 15,
              marginBottom: 15,
              backgroundColor: "#fff",
              borderRadius: 10,
              borderWidth: 3,
              borderColor: getPriorityColor(item.priority),
            }}
          >
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
            )}

            <Text style={{ fontSize: 20, fontWeight: "600" }}>{item.title}</Text>
            {item.description && <Text>{item.description}</Text>}
            {item.price && (
              <Text style={{ marginTop: 5, fontWeight: "bold" }}>
                💶 {item.price.toFixed(2)} €
              </Text>
            )}

            <Button
              title="Delete"
              color="red"
              onPress={async () => {
                await apiWishlistDelete(item.id);
                await loadWishlist();
              }}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
