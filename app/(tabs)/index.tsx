import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Overlay } from "@rneui/base";
import { View } from "react-native";
import { LifeBuoy } from "lucide-react-native";
import { Mic } from "lucide-react-native";
import { Smartphone } from "lucide-react-native";
import { Camera } from "lucide-react-native";

const Widget = () => {
  const [visible, setVisible] = useState(false);
  const [mic, setMic] = useState(false);

  return (
    <>
      <View
        style={{
          flex: 1,
          marginTop: 50,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          backgroundColor: "transparent",
        }}
      >
        <Button
          buttonStyle={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginLeft: 10,
          }}
          onPress={() => setVisible(true)}
        >
          <LifeBuoy color="white" size={23} />
        </Button>
      </View>
      <Overlay
        overlayStyle={styles.widget}
        isVisible={visible}
        onBackdropPress={() => {
          setVisible(false);
          setMic(false);
        }}
        backdropStyle={{ backgroundColor: "transparent" }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 10,
            backgroundColor: "transparent",
          }}
        >
          <Button
            style={styles.button}
            buttonStyle={{
              backgroundColor: mic ? "green" : "blue",
              borderRadius: "100%",
            }}
            onPress={() => {
              setMic(!mic);
              console.log(mic);
            }}
          >
            <Mic color="white" size={23} />
          </Button>
          <Button
            style={styles.button}
            buttonStyle={styles.buttonStyle}
            onPress={() => {
              console.log("Smartphone button pressed");
            }}
          >
            <Smartphone color="white" size={23} />
          </Button>
          <Button
            style={styles.button}
            buttonStyle={styles.buttonStyle}
            onPress={() => {
              console.log("Camera button pressed");
            }}
          >
            <Camera color="white" size={23} />
          </Button>
        </View>
      </Overlay>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  buttonStyle: {
    backgroundColor: "blue",
    borderRadius: "100%",
  },
  widget: {
    top: 0,
    left: 0,
    backgroundColor: "transparent",
    shadowColor: "transparent",
  },
});

export default Widget;
