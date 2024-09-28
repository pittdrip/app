import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const getCurrentDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export default function HomeScreen() {
  const currentDate = getCurrentDate();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.date}>{currentDate}</Text>
          <View style={styles.weatherContainer}>
            <Ionicons name="sunny" size={24} color="black" />
            <Text style={styles.weather}>75°F</Text>
          </View>
        </View>

        <View style={styles.outfitDisplay}>
          <Text style={styles.sectionTitle}>Your Outfit</Text>
          <View style={styles.outfitPlaceholder}>
            <Text>Outfit Image Placeholder</Text>
          </View>
        </View>

        <View style={styles.activitySelect}>
          <Text style={styles.sectionTitle}>Select Activity</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.activityScroll}>
            {['Work', 'Gym', 'Casual', 'Date Night', 'Formal'].map((activity, index) => (
              <Pressable key={index} style={styles.activityItem}>
                <Text>{activity}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <Link href="/home" asChild>
        <Pressable style={styles.pickOutfitButton}>
          <Text style={styles.buttonText}>Pick me an outfit!</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weather: {
    fontSize: 16,
    marginLeft: 5,
  },
  outfitDisplay: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  outfitPlaceholder: {
    width: '100%',
    height: 375,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activitySelect: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 10,
  },
  activityScroll: {
    flexDirection: 'row',
  },
  activityItem: {
    width: 75,
    height: 75,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  pickOutfitButton: {
    backgroundColor: 'green',
    padding: 15,
    height: 50,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});