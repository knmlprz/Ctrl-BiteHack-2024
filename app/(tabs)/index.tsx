import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Text, StyleSheet, Alert } from 'react-native';

const WebSocketScreen = () => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, [webSocket]);

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
    <View style={styles.container}>
      {!isConnected ? (
        <View>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
          <Button title="Connect" onPress={connectWebSocket} />
        </View>
      ) : (
        <View>
          <Text style={styles.connectedText}>Connected as {username}</Text>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={message}
            onChangeText={setMessage}
          />
          <Button title="Send Message" onPress={sendMessage} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  connectedText: {
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default WebSocketScreen;
