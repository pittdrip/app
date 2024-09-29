import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, FlatList, Image } from 'react-native';
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
  image?: string;
};

const categories = ['JACKET', 'SHOES', 'SHIRT', 'PANTS', 'SHORTS', 'SWEATSHIRT', 'OTHER'];

export default function ClosetScreen() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);

  const fetchClothingItems = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    const closetRef = collection(db, 'users', user.uid, 'closet');
    const q = query(closetRef);
    
    try {
      const querySnapshot = await getDocs(q);

      const items: ClothingItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          name: data.name || 'Unnamed Item',
          category: data.categories || 'OTHER',
          description: data.description,
          climate: data.climate,
          formality: data.formality,
          image: data.image,
        });
      });


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

  };

  const renderClothingItem = ({ item }: { item: ClothingItem }) => (
    <Pressable
      style={styles.clothingItem}
      onPress={() => handleItemClick(item)}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.clothingItemImage} />
      ) : (
        <View style={styles.clothingItemPlaceholder}>
          <Text style={styles.clothingItemText}>{item.name}</Text>
        </View>
      )}
    </Pressable>
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
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  clothingItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  clothingItemPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clothingItemText: {
    textAlign: 'center',
    padding: 5,
  },
});