import React from 'react';
import { View, Text, Button } from 'react-native';
import {
  createStaticNavigation, 
  useNavigation,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

//import { Button } from '@react-navigation/elements';

export default function HomeScreen( {navigation}: Props ) {
  //const navigation = useNavigation();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 26 }}>🎁 Wishlist App</Text>
      <Button title="Go to Wishlist" onPress={() => navigation.navigate('Wishlist')} />
    </View>
  );
}