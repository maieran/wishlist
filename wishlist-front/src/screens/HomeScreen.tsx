import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { apiGet } from '../api/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const me = await apiGet("/api/auth/me");
        // Erwartet: { id, username, displayName, admin }
        setAdmin(!!me.admin);
      } catch (e) {
        console.log("Error loading /api/auth/me", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 }}>
      {admin && (
        <Button
          title="Admin Panel"
          onPress={() => navigation.navigate('AdminUsers')}
        />
      )}

      <Text style={{ fontSize: 26 }}>🎁 Wishlist App</Text>

      <Button
        title="Go to Wishlist"
        onPress={() => navigation.navigate('Wishlist')}
      />
    </View>
  );
}
