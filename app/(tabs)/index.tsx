import { Animated, Easing, StyleSheet, Text, Image, Alert} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Overlay } from "@rneui/base";
import { View } from "react-native";
import { Mic } from "lucide-react-native";
import { ScrollView } from "react-native";

const Widget = () => {
  // WebSocket
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState('l');
  const [password, setPassword] = useState('a');
  const [message, setMessage] = useState('post_start');
  const [isConnected, setIsConnected] = useState(false);
  // Websocket
  const [loading, setLoading] = useState(false);
  const [mic, setMic] = useState(false);
  const [text, setText] = useState("");

  const FadeInView = ({
    children,
    duration = 500,
    style,
    opener,
  }: {
    children: React.ReactNode;
    duration?: number;
    style?: object;
    opener?: any;
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1, // Final opacity value
        duration: duration, // Animation duration in milliseconds
        useNativeDriver: true, // Optimize the animation
      }).start();
    }, [fadeAnim, duration]);

    return (
      <Animated.View // Special Animated View
        style={[
          style,
          {
            display: opener ? "flex" : "none",
            opacity: fadeAnim, // Bind opacity to the animated value
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  };
  const ScrollFadeInView = ({
    children,
    duration = 500,
    style,
    opener,
  }: {
    children: React.ReactNode;
    duration?: number;
    style?: object;
    opener?: any;
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity value

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1, // Final opacity value
        duration: duration, // Animation duration in milliseconds
        useNativeDriver: true, // Optimize the animation
      }).start();
    }, [fadeAnim, duration]);

    return (
      <Animated.ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: 25,
          padding: 30,
          justifyContent: "center",
          alignItems: "center",
        }}
        style={[
          style,
          {
            display: opener ? "flex" : "none",
            opacity: fadeAnim, // Bind opacity to the animated value
          },
        ]}
      >
        {children}
      </Animated.ScrollView>
    );
  };


  useEffect(()=>{
    connectWebSocket();
  },[])

  useEffect(() => {
    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, [webSocket]);

  function sendRequest(prompt: string) {
    const url = "http://192.168.7.145:8008/query";

    const data = {
      input: prompt,
    };

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        setText(data.answer);
      })
      .catch((error) => {
        console.error(`Error: ${error.message}`);
      });
  }

  const connectWebSocket = () => {
    if (!username) {
      Alert.alert('Error', 'Username cannot be empty.');
      return;
    }

    if (password !== 'a') {
      Alert.alert('Invalid Password', 'The password must be "a"');
      return;
    }

    const ws = new WebSocket('wss://rafal.tail43fbf9.ts.net/');

    ws.onopen = () => {
      console.log('WebSocket connection opened.');
      setIsConnected(true);
      const data = {
        peer: username,
        action: 'new-peer',
        message: {},
      };
      ws.send(JSON.stringify(data));
    };

    ws.onmessage = (event) => {
      console.log('Message received from server:', event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed.');
      setIsConnected(false);
      setWebSocket(null);
    };

    ws.onerror = (error) => {
      console.log('WebSocket error:', error);
      Alert.alert('WebSocket Error', 'Failed to connect.');
    };

    setWebSocket(ws);
  };

  const sendMessage = () => {
    if (webSocket && isConnected) {
      const data = {
        peer: username,
        action: 'send-message',
        message: {
          content: message,
        },
      };
      webSocket.send(JSON.stringify(data));
      console.log('Message sent:', data);
      setMessage('');
    } else {
      Alert.alert('Error', 'WebSocket is not connected.');
    }
  };


  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          marginTop: 50,
          gap: 15,
          justifyContent: "flex-start",
          alignItems: "stretch",
          backgroundColor: "transparent",
        }}
      >
        <Button
          buttonStyle={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginLeft: 10,
            backgroundColor: mic ? "green" : "blue",
          }}
          onPress={async () => {
            setMic(!mic);
            if (mic) {
              sendMessage()
              setMessage('post_start');
              // start listening
              setLoading(true);
              await new Promise((resolve) => setTimeout(resolve, 3000));
              try {
                setText(
                  '1. Otwórz przeglądarkę internetową lub aplikację pocztową na urządzeniu mobilnym.\n2. Kliknij w zakładkę "Nowy e-mail" lub ikonę pięciu kropki przy pasku adresu URL.\n3. Wprowadź nazwę odbiorcy (adres e-mail) w polu "Odbiorca".\n4. Wprowadź temat wiadomości e-mail w polu "Temat".\n5. Napisz treść wiadomości w oknie edytorskim.\n6. Dodaj przyłączony plik, jeśli jest to konieczne (opcjonalnie).\n7. Kliknij przycisk "Wyślij" lub ikonę papierka zlecenia, aby wysłać wiadomość.'
                );
                // await sendRequest("Jak się myć?");
              } catch (error) {
                setText("Error occurred");
              }
            } else {
              // stop listening
              sendMessage();
              setMessage('post_end');
              setLoading(false);
            }
          }}
        >
          <Mic color="white" size={23} />
        </Button>
        <FadeInView duration={1000} style={styles.showUp} opener={mic}>
          <Text
            style={{
              textAlign: "center",
            }}
          >
            Mów teraz ...
          </Text>
        </FadeInView>
      </View>
      <ScrollFadeInView
        duration={1700}
        style={styles.scroller}
        opener={loading}
      >
        <Text style={{ textAlign: "center", fontSize: 34 }}>
          {loading && text.length > 0 ? text : "Loading..."}
        </Text>
        <Button
          onPress={() => {
            setLoading(false);
            setMic(false);
            setText("");
          }}
          style={{
            marginTop: 20,
            backgroundColor: "blue",
            borderRadius: 15,
            width: 100,
          }}
        >
          Zamknij
        </Button>
      </ScrollFadeInView>
      <Image
        source={require("../../assets/background.jpg")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
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
    zIndex: -1000,
  },
  showUp: {
    height: 50,
    width: "70%",
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  scroller: {
    height: 200,
    width: "90%",
    marginLeft: 0,
    marginBottom: 100,
    backgroundColor: "white",
    borderRadius: 15,
    alignSelf: "center",
    padding: 20,
  },
});

export default Widget;
