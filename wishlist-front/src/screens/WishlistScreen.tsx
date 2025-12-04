import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { loadWishlist, deleteWishlistItem, WishlistItem, Priority } from "../store/wishlistStore";
import { apiTeamMe } from "../api/team";
import { apiMatchingConfig } from "../api/matching";

type Props = NativeStackScreenProps<RootStackParamList, "Wishlist">;

export default function WishlistScreen({ navigation }: Props) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<
    "priority" | "alphaAsc" | "alphaDesc" | "priceAsc" | "priceDesc" | "none"
  >("priority");

  const [hasTeam, setHasTeam] = useState(false);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [matchingExecuted, setMatchingExecuted] = useState(false);

  const reload = useCallback(async () => {
    try {
      const data = await loadWishlist();
      setItems(data);
    } catch (e) {
      console.log("Error loading wishlist", e);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  // Team + Matching Status laden
  useEffect(() => {
    async function loadTeamAndMatching() {
      try {
        const teamRes = await apiTeamMe();
        if ("hasTeam" in teamRes && !teamRes.hasTeam) {
          setHasTeam(false);
          setTeamId(null);
          setMatchingExecuted(false);
          return;
        }

        const team = "hasTeam" in teamRes ? teamRes : { hasTeam: true, ...teamRes };
        setHasTeam(true);
        setTeamId(team.teamId);

        const cfg = await apiMatchingConfig();
        setMatchingExecuted(!!cfg.executed);
      } catch (e) {
        console.log("Error loading team/matching", e);
      }
    }
    loadTeamAndMatching();
  }, []);

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case "red":
        return "#ff4d4f";
      case "blue":
        return "#40a9ff";
      case "green":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  let visibleItems = [...items];

  if (search.trim() !== "") {
    visibleItems = visibleItems.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (sortMode === "priority") {
    const order = { red: 1, blue: 2, green: 3, none: 4 };
    visibleItems.sort((a, b) => order[a.priority] - order[b.priority]);
  }

  if (sortMode === "alphaAsc") {
    visibleItems.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortMode === "alphaDesc") {
    visibleItems.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (sortMode === "priceAsc") {
    visibleItems.sort((a, b) => a.price - b.price);
  }

  if (sortMode === "priceDesc") {
    visibleItems.sort((a, b) => b.price - a.price);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginBottom: 10,
        }}
      />

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
        <View style={{ marginRight: 8, marginBottom: 8 }}>
          <Button title="Priority" onPress={() => setSortMode("priority")} />
        </View>

        <View style={{ marginRight: 8, marginBottom: 8 }}>
          <Button
            title="A–Z ↕"
            onPress={() => {
              if (sortMode === "alphaAsc") setSortMode("alphaDesc");
              else if (sortMode === "alphaDesc") setSortMode("none");
              else setSortMode("alphaAsc");
            }}
          />
        </View>

        <View style={{ marginRight: 8, marginBottom: 8 }}>
          <Button
            title="Price ↕"
            onPress={() => {
              if (sortMode === "priceAsc") setSortMode("priceDesc");
              else if (sortMode === "priceDesc") setSortMode("none");
              else setSortMode("priceAsc");
            }}
          />
        </View>

        <View style={{ marginRight: 8, marginBottom: 8 }}>
          <Button title="None" onPress={() => setSortMode("none")} />
        </View>
      </View>

      <Button title="Add Item" onPress={() => navigation.navigate("AddItem")} />

      {/* Partner-Button */}
      {hasTeam && matchingExecuted && (
        <View style={{ marginTop: 20 }}>
          <Button
            title="🎅 Meinen Partner anzeigen"
            onPress={() => navigation.navigate("MyPartner")}
          />
        </View>
      )}

      <FlatList
        style={{ marginTop: 10 }}
        data={visibleItems}
        keyExtractor={(x) => String(x.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EditItem", { id: String(item.id) })}
            style={{
              padding: 15,
              marginVertical: 10,
              backgroundColor: "#fdfdfd",
              borderRadius: 10,
              borderWidth: 3,
              borderColor: getPriorityColor(item.priority),
            }}
          >
            {item.imageUri && (
              <Image
                source={{ uri: item.imageUri }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
            )}

            <Text style={{ fontSize: 20 }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text style={{ fontWeight: "bold" }}>{item.price} EUR</Text>

            <Button
              title="Delete"
              onPress={async () => {
                await deleteWishlistItem(String(item.id));
                await reload();
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
