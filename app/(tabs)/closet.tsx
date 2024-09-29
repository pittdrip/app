import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, getDocs } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';

type ClothingItem = {
  id: string;
  name: string;
  category: string;
};

const categories = ['JACKET', 'SHOES', 'SHIRT', 'PANTS', 'SHORTS', 'SWEATSHIRT', 'OTHER'];

export default function ClosetScreen() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  useEffect(() => {
    const fetchClothingItems = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const closetRef = collection(db, 'users', user.uid, 'closet');
      const q = query(closetRef);
      const querySnapshot = await getDocs(q);

      const items: ClothingItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          name: data.name,
          category: data.categories,
        });
      });

      setClothingItems(items);
    };

    fetchClothingItems();
  }, []);

  const renderClothingItem = ({ item }: { item: ClothingItem }) => (
    <View style={styles.clothingItem}>
      <Text style={styles.clothingItemText}>{item.name}</Text>
    </View>
  );

  const renderCategory = (category: string) => {
    const categoryItems = clothingItems.filter((item) => item.category === category);

    return (
      <View style={styles.categoryContainer} key={category}>
        <Text style={styles.categoryTitle}>{category}</Text>
        <FlatList
          data={categoryItems}
          renderItem={renderClothingItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>My Closet</Text>
      <ScrollView style={styles.categoriesContainer}>
        {categories.map(renderCategory)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoriesContainer: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  clothingItem: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 10,
  },
  clothingItemText: {
    textAlign: 'center',
    padding: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});