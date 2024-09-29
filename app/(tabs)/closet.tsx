import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, FlatList, Image, Modal, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
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

const categories = ['SHIRT', 'PANTS', 'SHORTS', 'SWEATSHIRT'];

export default function ClosetScreen() {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

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
          category: data.categories,
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
    setSelectedItem(item);
  };

  const handleDeleteItem = async () => {
    if (!selectedItem || !auth.currentUser) return;

    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const itemRef = doc(db, 'users', auth.currentUser!.uid, 'closet', selectedItem.id);
              await deleteDoc(itemRef);
              setClothingItems(prevItems => prevItems.filter(item => item.id !== selectedItem.id));
              setSelectedItem(null);
              Alert.alert("Success", "Item deleted successfully");
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Error", "Failed to delete item. Please try again.");
            }
          }
        }
      ]
    );
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
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>My</Text>
        <Text style={[styles.logoText, styles.logoTextDrip]}>Closet</Text>
      </View>
      <ScrollView style={styles.categoriesContainer}>
        {categories.map(renderCategory)}
      </ScrollView>
      <Link href="/scan-modal" asChild>
        <Pressable style={styles.cameraButton}>
          <Ionicons name="camera" size={30} color="#FFB81C" />
        </Pressable>
      </Link>
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedItem !== null}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {selectedItem && (
              <>
                {selectedItem.image && (
                  <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
                )}
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalText}>Category: {selectedItem.category}</Text>
                {selectedItem.description && (
                  <Text style={styles.modalText}>Description: {selectedItem.description}</Text>
                )}
                {selectedItem.climate && (
                  <Text style={styles.modalText}>Climate: {selectedItem.climate}</Text>
                )}
                {selectedItem.formality && (
                  <Text style={styles.modalText}>Formality: {selectedItem.formality}</Text>
                )}
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setSelectedItem(null)}
                  >
                    <Text style={styles.textStyle}>Close</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonDelete]}
                    onPress={handleDeleteItem}
                  >
                    <Text style={styles.textStyle}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#003594',
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFB81C',
  },
  logoTextDrip: {
    color: '#FFFFFF',
    marginLeft: 5,
  },
  categoriesContainer: {
    flex: 1,
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003594',
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
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clothingItemText: {
    textAlign: 'center',
    padding: 5,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#003594',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    justifyContent: 'center',
    borderRadius: 20,
    height: 50,
    width: 100,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#003594',
  },
  buttonDelete: {
    backgroundColor: '#FF0000',
  },
  textStyle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});