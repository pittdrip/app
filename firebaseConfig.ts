import { initializeApp } from "firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth'
import { getStorage } from "@firebase/storage"
import { getVertexAI, getGenerativeModel } from "@firebase/vertexai-preview"
import { getFirestore } from "@firebase/firestore"
import { getFunctions } from "@firebase/functions"
import Constants from 'expo-constants';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize the Vertex AI service
export const vertexAI = getVertexAI(app);

export const db = getFirestore(app, "default");

export const functions = getFunctions(app);

// Initialize the generative model with a model that supports your use case
// Gemini 1.5 models are versatile and can be used with all API capabilities
export const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

export const store = getStorage(app);