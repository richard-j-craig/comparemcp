import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import outputs from './amplify_outputs.json';

Amplify.configure(outputs);

const client = generateClient();

export default function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const callFunction = async () => {
      try {
        const result = await client.queries.sayHello({
          name: 'World'
        });
        setMessage(result.data || 'No response');
      } catch (error) {
        console.error('Error calling function:', error);
        setMessage('Error: ' + error.message);
      }
    };

    callFunction();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amplify Function Test</Text>
      <Text style={styles.message}>{message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
});