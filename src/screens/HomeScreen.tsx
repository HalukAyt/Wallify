import React from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { WALLPAPERS } from '../data/wallpapers';
import type { RootStackParamList } from '../../app/App';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


const { width } = Dimensions.get('window');
const GAP = 8;
const NUM_COLS = 2;
const ITEM_SIZE = (width - GAP * (NUM_COLS + 1)) / NUM_COLS;


type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export default function HomeScreen({ navigation }: Props) {
return (
<View style={styles.container}>
<FlatList
data={WALLPAPERS}
keyExtractor={(item) => item.id}
numColumns={NUM_COLS}
contentContainerStyle={{ padding: GAP }}
renderItem={({ item }) => (
<TouchableOpacity
style={styles.card}
onPress={() => navigation.navigate('Detail', { id: item.id })}
activeOpacity={0.85}
>
<Image source={{ uri: item.thumb ?? item.url }} style={styles.image} resizeMode="cover" />
{item.title ? <Text style={styles.title} numberOfLines={1}>{item.title}</Text> : null}
</TouchableOpacity>
)}
/>
</View>
);
}


const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#0b0b0b' },
card: { width: ITEM_SIZE, margin: GAP, borderRadius: 12, overflow: 'hidden', backgroundColor: '#111' },
image: { width: '100%', height: ITEM_SIZE * 1.2 },
title: { color: 'white', padding: 8, fontWeight: '600' },
});