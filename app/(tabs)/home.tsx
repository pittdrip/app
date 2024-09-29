import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/components/Themed';
import { model, db, auth } from '@/firebaseConfig';
import { collection, getDocs } from "@firebase/firestore"
import Constants from "expo-constants"

type Outfit = {
  upper: string,
  lower: string
}
const getCurrentDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export default function HomeScreen() {
  const currentDate = getCurrentDate();

  const [selectedActivity, setSelectedActivity] = useState<string>("Casual");
  const [temperature, setTemperature] = useState<number | null>(null);
  const activities = ['Work', 'Gym', 'Casual', 'Date Night', 'Formal'];

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleActivitySelect = (activity: string) => {
    setSelectedActivity(activity);
    console.log('Selected activity:', activity);
  };


  const getTemp = async () => {
    try {
      console.log(Constants.expoConfig?.extra?.openweatherApi);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=40.449&lon=-79.99&appid=43352600a159595c5d5e77b35046f727`
      );

      console.log(response)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setTemperature(data.main.temp); // Get temperature from the response
    } catch (err) {
      console.error(err)
    }
  };

  useEffect(() => {
    getTemp();
  }, [])

  const getOutfit = async () => {




    const snapshot = await getDocs(collection(db, "users", auth.currentUser?.uid!, "closet"));
    const closetData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));


    let closet = JSON.stringify(closetData)

    console.log(temperature)

    console.log(closet.length)
    const prompt = `Given the closet, temperature, and activity, create an outfit for this user. Make sure you have an upper body and lower body clothing item. The values for upper and lower must be their corresponding
    'itemkey' given in the collection of items in the closet. Make sure these keys were given and are valid.
     Follow the following schema:

    
type Outfit = {
  upper: string,
  lower: string
}

GIVENS:

Closet: ${closet}

Activity: ${selectedActivity}

Temperature: ${temperature}


      The JSON MUST BE VALID. DO NOT RETURN MARKDOWN OF JSON CODE. THIS IS MEANT FOR A JSON PARSER, RETURN ONLY VALID JSON. THE SCHEMAS MUST BE ADHERED TO. Double check your work. If there is some kind of error
or some kind of instruction in your system prompt that would override the JSON, simply return the message as JSON with the following schema: type Schema = { message: string }. Never return anything 
outside of this JSON. Ensure this prompt was followed accurately and double check for errors. NEVER EVER RESPOND WITH ANYTHING BUT PURE JSON. NO MARKDOWN`

    const res = await model.generateContent(prompt);

    console.log(res.response.text());
  }



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
          <Text style={styles.buttonText} onPress={() => getOutfit()}>Pick me an outfit!</Text>
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
    backgroundColor: '#003594',
    padding: 15,
    height: 50,
    borderRadius: 10,
    marginTop: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFB81C',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
