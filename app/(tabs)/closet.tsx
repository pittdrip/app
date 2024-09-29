import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, getDocs } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';

type ClothingItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
  climate?: string;
  formality?: string;
};

const categories = ['JACKET', 'SHOES', 'SHIRT', 'PANTS', 'SHORTS', 'SWEATSHIRT', 'OTHER'];

export default function ClosetScreen() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  const fetchClothingItems = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
      return;
    }

    console.log("Fetching clothing items for user:", user.uid);

    const closetRef = collection(db, 'users', user.uid, 'closet');
    const q = query(closetRef);
    
    try {
      const querySnapshot = await getDocs(q);
      console.log("Number of documents retrieved:", querySnapshot.size);

      const items: ClothingItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Document data:", data);
        items.push({
          id: doc.id,
          name: data.name || 'Unnamed Item',
          category: data.categories || 'OTHER',
          description: data.description,
          climate: data.climate,
          formality: data.formality,
        });
      });

      console.log("Processed items:", items);
      setClothingItems(items);
    } catch (error) {
      console.error("Error fetching clothing items:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchClothingItems();
    }, [fetchClothingItems])
  );

  const handleItemClick = (item: ClothingItem) => {
    console.log('Item clicked:', item);
    console.log('Item details:');
    console.log('- Name:', item.name);
    console.log('- Category:', item.category);
    console.log('- Description:', item.description || 'No description');
    console.log('- Climate:', item.climate || 'Not specified');
    console.log('- Formality:', item.formality || 'Not specified');
  };

  const renderClothingItem = ({ item }: { item: ClothingItem }) => (
    <Pressable
      style={styles.clothingItem}
      onPress={() => handleItemClick(item)}
    >
      <Text style={styles.clothingItemText}>{item.name}</Text>
    </Pressable>
  );

  const renderCategory = (category: string) => {
    const categoryItems = clothingItems.filter((item) => item.category === category);
    console.log(`Rendering category ${category} with ${categoryItems.length} items`);

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
      <ScrollView style={styles.categoriesContainer}>
        {categories.map(renderCategory)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#003594',
    padding: 10,
    borderRadius: 15
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFB81C',
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