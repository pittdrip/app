// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth'
import { getStorage } from "@firebase/storage"
import { getVertexAI, getGenerativeModel } from "@firebase/vertexai-preview"
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

// Initialize the Vertex AI service
export const vertexAI = getVertexAI(app);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
export const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

export const store = getStorage(app);
