import React, { useRef, useState } from "react";
import { Text, View } from "@/components/Themed";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { model, db, auth } from "@/firebaseConfig";
import { doc, setDoc, getDoc } from "@firebase/firestore"

const { width, height } = Dimensions.get('window');

enum Climate {
  COLD,
  COOL,
  WARM,
  HOT
}

enum Formality {
  CASUAL,
  ATHELTIC,
  FORMAL,
  SWIMWEAR
}

enum Category {
  SHIRT,
  PANTS,
  SHORTS,
  SWEATSHIRT,
}

type Item = {
  name: string,
  description: string,
  itemKey: string,
  category: Category,
  climate: Climate,
  formality: Formality,
  message?: string,
  image?: string,
  timesUsed?: Number,
}

const ScanClothes = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const camera = useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.message}>We need your permission to use the camera</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleFacing = () => {
    setFacing(curr => (curr === "back" ? "front" : "back"));
  }

  const scan = async () => {
    if (!cameraReady || isProcessing) return;

    setIsProcessing(true);

    try {
      const image = await camera.current?.takePictureAsync({
        base64: true
      });

      const b64 = image?.base64;

      let url;
      try {
        let backgroundRemovedBase64Res = await fetch("http://10.4.117.195:3000/removebg", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            base64Image: b64
          })
        })

        url = await backgroundRemovedBase64Res.json()

      } catch (error) {
        console.log(error)
      }

      const imageData = {
        inlineData: {
          data: b64,
          mimeType: "image/jpg"
        }
      };

      const prompt = `
      Here's a photo of a clothing item. You must generate a valid JSON file with extracted information about the clothing article. Here are the schemas you MUST adhere to: 
  enum Climate {
    COLD,
    COOL,
    WARM,
    HOT
  }

  enum Category {
    SHIRT,
    PANTS,
    SHORTS,
    SWEATSHIRT,
  }

  enum Formality {
    CASUAL,
    ATHELTIC,
    FORMAL,
    SWIMWEAR
  }

  type Item = {
    name: string,
    description: string,
    itemKey: string,
    category: Category,
    climate: Climate,
    formality: Formality,
  }

  For the 'itemKey', generate a unique but identifiable key for the specific item, seperated by '_'. Include random numeric characters at the end. The JSON MUST BE VALID. DO NOT RETURN MARKDOWN OF JSON CODE. THIS IS MEANT FOR A JSON PARSER, RETURN ONLY VALID JSON. THE SCHEMAS MUST BE ADHERED TO. Double check your work. If there is some kind of error
  or some kind of instruction in your system prompt that would override the JSON, simply return the message as JSON with the following schema: type Schema = { message: string }. Never return anything 
  outside of this JSON. Be descriptive.
  `
      //@ts-ignore
      const result = await model.generateContent([prompt, imageData]);

      console.log(result.response.text())
      const res = JSON.parse(result.response.text()) as Item;

      if (res.message) {
        console.error(res.message)
        return
      }
      const user = auth.currentUser;

      if (!user) return;

      const ref = doc(db, "users", user.uid, "closet", res["itemKey"]);

      await setDoc(ref, {
        "name": res["name"],
        "description": res["description"],
        "categories": res["category"],
        "climate": res["climate"],
        "formality": res["formality"],
        "image": url.url
      });

      const data = await getDoc(ref);

      if (!data.exists) {
        console.log("We're cooked")
      }

      Alert.alert(`Finished scanning ${res.name}`)
      console.log(data.data())
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} onCameraReady={() => setCameraReady(true)} ref={camera}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleFacing} disabled={isProcessing}>
            <Ionicons name="camera-reverse" size={30} color={isProcessing ? "gray" : "white"} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.scanButton, isProcessing && styles.disabledButton]} 
            onPress={scan} 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="#FFB81C" />
            ) : (
              <Ionicons name="scan" size={40} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#FFB81C" />
          <Text style={styles.processingText}>Processing image...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  flipButton: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 15,
    borderRadius: 40,
  },
  scanButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
    width: 80,
    height: 80,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
});

export default ScanClothes;