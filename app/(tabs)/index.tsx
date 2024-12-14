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

  function sendRequest(prompt: string) {
    const url = 'http://192.168.7.64:8080/api/generate';
  
    const data = {
      model: 'wnuczek',
      prompt: prompt,
      stream: false,
    };
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.response);
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`);
      });
  }
  

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
            const newMicState = !mic;
            setMic(newMicState);

            if (newMicState) {
              console.log("włączono");
              // sendRequest("Start recording audio");
            } else {
              console.log("wyłączono");
              sendRequest("How to start recording audio");
            }
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
