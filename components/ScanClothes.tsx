import React, { useRef, useState } from "react";
import { Text, View } from "@/components/Themed";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { model } from "@/firebaseConfig";

const { width, height } = Dimensions.get('window');

const ScanClothes = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState<boolean>(false);
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
    if (!cameraReady) return;

    const image = await camera.current?.takePictureAsync({
      base64: true
    });

    const b64 = image?.base64;

    const imageData = {
      inlineData: {
        data: b64,
        mimeType: "image/jpg"
      }
    };

    const prompt = "What do you see?";

    //@ts-ignore
    const result = await model.generateContent([prompt, imageData]);
    console.log(result.response.text());
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing} onCameraReady={() => setCameraReady(true)} ref={camera}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleFacing}>
            <Ionicons name="camera-reverse" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.scanButton} onPress={scan}>
            <Ionicons name="scan" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    borderRadius: 50,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ScanClothes;