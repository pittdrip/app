// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAS77RaGZxisZelU3expwfY-lbzxrdqwVo",
    authDomain: "pitt-drip.firebaseapp.com",
    projectId: "pitt-drip",
    storageBucket: "pitt-drip.appspot.com",
    messagingSenderId: "766697609837",
    appId: "1:766697609837:web:db597dde8113d3077e3d64"
  };  

// Initialize Fisrebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});