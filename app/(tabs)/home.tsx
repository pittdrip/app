import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/components/Themed';

const getCurrentDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export default function HomeScreen() {
  const currentDate = getCurrentDate();
  
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const activities = ['Work', 'Gym', 'Casual', 'Date Night', 'Formal'];

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    console.log('Selected activity:', activity);
  };

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
    fontSize: 22,
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
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  outfitPlaceholder: {
    width: '100%',
    height: 385,
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
    alignItems: "center"
  },
  selectedActivityDisplay: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityText: {
    color: 'black',
  },
  selectedActivityItem: {
    backgroundColor: 'green',
  },
  selectedActivityText: {
    color: 'white',
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
    backgroundColor: 'green',
    padding: 15,
    height: 50,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});