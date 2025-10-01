import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
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
  stars: number;
  lastUpdated: string;
}

export default function App() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");

  const fetchServers = async (search: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const serversResponse = await client.queries.listMcpServers({
        searchTerm: search || null,
      });
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

  useEffect(() => {
    fetchServers();
  }, []);

  const handleSearch = () => {
    fetchServers(searchInput);
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search MCP servers..."
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? "..." : "Search"}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading servers...</Text>
          </View>
        )}

        {error && <Text style={styles.errorText}>Error: {error}</Text>}

        {!loading && !error && (
          <>
            <Text style={styles.resultsCount}>
              {servers.length} {servers.length === 1 ? "server" : "servers"}{" "}
              found
            </Text>

            <View style={styles.serverList}>
              {servers.map((server, index) => (
                <View key={index} style={styles.serverCard}>
                  <View style={styles.serverHeader}>
                    <Text style={styles.serverName}>{server.name}</Text>
                    <View style={styles.starsContainer}>
                      <Text style={styles.starsText}>⭐ {server.stars}</Text>
                    </View>
                  </View>
                  <Text style={styles.serverDescription}>
                    {server.description}
                  </Text>
                  <View style={styles.serverFooter}>
                    <Text style={styles.lastUpdated}>
                      Updated: {formatDate(server.lastUpdated)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleLinkPress(server.link)}
                    >
                      <Text style={styles.serverLink}>View on GitHub →</Text>
                    </TouchableOpacity>
                  </View>
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
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginTop: 50,
    padding: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    textAlign: "center",
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
  serverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serverName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  starsContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  starsText: {
    fontSize: 12,
    color: "#666",
  },
  serverDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 12,
  },
  serverFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastUpdated: {
    fontSize: 12,
    color: "#999",
  },
  serverLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});
