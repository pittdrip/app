import { Text, View } from "@/components/Themed"
import { CameraView, CameraType, Camera, useCameraPermissions, CameraProps } from "expo-camera"
import { Button, StyleSheet, TouchableOpacity } from "react-native"
import { useRef, useState } from "react"
import { toByteArray } from "react-native-quick-base64"

import uuid from 'react-native-uuid';
import { model } from "@/firebaseConfig"
const ScanClothes = () => {
  const [facing, setFacing] = useState<CameraType>("back")

  const [permission, requestPermission] = useCameraPermissions()

  const [cameraReady, setCameraReady] = useState<boolean>(false)
  const camera = useRef<CameraView | null>(null)



  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    <View style={styles.container}>
      <Text style={styles.message}>We need your permission to show the camera</Text>
      <Button onPress={requestPermission} title="grant permission" />
    </View>
  }

  const toggleFacing = () => {
    setFacing(curr => (curr === "back" ? "front" : "back"))
  }



  const scan = async () => {
    if (!cameraReady) return

    const image = await camera.current?.takePictureAsync({
      base64: true
    })

    const b64 = image?.base64;

    const imageData = {
      inlineData: {
        data: b64, mimeType: "image/jpg"
      }
    }

    const prompt = "What do you see?"

    const result = await model.generateContent([prompt, imageData])
    console.log(result.response.text())


  }
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} onCameraReady={() => setCameraReady(true)} ref={camera}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleFacing}>
            <Text>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={scan}>
            <Text>
              Scan
            </Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: "center",
    paddingBottom: 10
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center"
  },
  button: {
  }
})
export default ScanClothes;
