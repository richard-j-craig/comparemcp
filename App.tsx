import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Schema } from "./amplify/data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import outputs from "./amplify_outputs.json";
import { useEffect, useState } from "react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

interface McpServer {
  name: string;
  description: string;
  link: string;
}

export default function App() {
  const [greeting, setGreeting] = useState<string>("");
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch greeting
        const greetingResponse = await client.queries.sayHello({
          name: "Amplify",
        });
        if (greetingResponse.data) {
          setGreeting(greetingResponse.data);
        }

        // Fetch MCP servers
        const serversResponse = await client.queries.listMcpServers();
        if (serversResponse.data) {
          const parsedServers = JSON.parse(serversResponse.data);
          setServers(parsedServers);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {loading && <Text style={styles.loadingText}>Loading...</Text>}
        {error && <Text style={styles.errorText}>Error: {error}</Text>}

        {!loading && !error && (
          <>
            <Text style={styles.title}>MCP Server Directory</Text>
            {greeting && <Text style={styles.greeting}>{greeting}</Text>}

            <View style={styles.serverList}>
              {servers.map((server, index) => (
                <View key={index} style={styles.serverCard}>
                  <Text style={styles.serverName}>{server.name}</Text>
                  <Text style={styles.serverDescription}>
                    {server.description}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleLinkPress(server.link)}
                  >
                    <Text style={styles.serverLink}>View on GitHub →</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginTop: 50,
    padding: 20,
  },
  serverList: {
    gap: 15,
  },
  serverCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serverName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  serverDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  serverLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});
