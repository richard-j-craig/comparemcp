import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Schema } from "./amplify/data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import outputs from "./amplify_outputs.json";
import { useEffect, useState } from "react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [greeting, setGreeting] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const response = await client.queries.sayHello({
          name: "Amplify",
        });

        if (response.data) {
          setGreeting(response.data);
        }
      } catch (err) {
        console.error("Error calling sayHello:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchGreeting();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {error && <Text>Error: {error}</Text>}
      {greeting && <Text>{greeting}</Text>}
      <Text>Open up App.tsx to start working on your app!</Text>
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
  },
});
