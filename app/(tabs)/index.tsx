import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Overlay } from "@rneui/base";
import { View } from "react-native";
import { Mic } from "lucide-react-native";
import { Smartphone } from "lucide-react-native";
import { Camera } from "lucide-react-native";

export default function HomeScreen() {
  const [visible, setVisible] = useState(true);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <Overlay
      isVisible={visible}
      style={styles.widget}
      onBackdropPress={toggleOverlay}
      backdropStyle={{ backgroundColor: "rgba(0,0,0,0)" }}
    >
      <View
        style={{
          flex: 1,
          gap: 5,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          onPress={() => {
            console.log("Mic button pressed");
          }}
        >
          <Mic color="white" size={23} />
        </Button>
        <Button
          onPress={() => {
            console.log("Smartphone button pressed");
          }}
        >
          <Smartphone color="white" size={23} />
        </Button>
        <Button
          onPress={() => {
            console.log("Camera button pressed");
          }}
        >
          <Camera color="white" size={23} />
        </Button>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  widget: {
    position: "fixed",
    top: 10, // Changed from 10 to 50
    left: 50, // Changed from 20 to 50
    transform: [{ translateX: 0 }, { translateY: 0 }],
  },
});
