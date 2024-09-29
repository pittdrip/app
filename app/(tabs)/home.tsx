import React, { useState } from 'react';
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

  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const activities = ['Work', 'School', 'Gym', 'Casual', 'Formal'];

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    console.log('Selected activity:', activity);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Pitt</Text>
        <Text style={[styles.logoText, styles.logoTextDrip]}>Drip</Text>
      </View>

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
          {activities.map((activity, index) => (
            <Pressable
              key={index}
              style={[
                styles.activityItem,
                selectedActivity === activity && styles.selectedActivityItem
              ]}
              onPress={() => handleActivitySelect(activity)}
            >
              <Text style={selectedActivity === activity ? styles.selectedActivityText : styles.activityText}>
                {activity}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Link href="/home" asChild>
        <Pressable style={styles.pickOutfitButton}>
          <Text style={styles.buttonText}>Pick my outfit!</Text>
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
  header: {
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
    fontSize: 18,
    marginLeft: 5,
  },
  outfitDisplay: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  outfitPlaceholder: {
    width: '100%',
    height: 350,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activitySelect: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    padding: 20,
    alignItems: "center"
  },
  activityText: {
    color: 'black',
  },
  selectedActivityItem: {
    backgroundColor: '#003594',
  },
  selectedActivityText: {
    color: '#FFB81C',
    fontWeight: 'bold',
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
    backgroundColor: '#FFB81C',
    padding: 15,
    height: 50,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#003594',
    fontSize: 18,
    fontWeight: '800',
  },
});