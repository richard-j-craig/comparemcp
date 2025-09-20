import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import { useState, useEffect } from 'react';

const API_URL = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/search';

export default function App() {
  const [servers, setServers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchServers = async (query = '') => {
    try {
      setLoading(true);
      const url = query ? `${API_URL}?q=${encodeURIComponent(query)}` : API_URL;
      const response = await fetch(url);
      const data = await response.json();
      setServers(data.servers || []);
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServers(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const renderServer = ({ item }) => (
    <View style={styles.serverItem}>
      <Text style={styles.serverName}>{item.name}</Text>
      <Text style={styles.serverDescription}>{item.description}</Text>
      <Text style={styles.serverMeta}>⭐ {item.stars} • {item.language}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MCP Server Directory</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search MCP servers..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={servers}
        renderItem={renderServer}
        keyExtractor={(item) => item.id}
        style={styles.list}
        refreshing={loading}
        onRefresh={() => fetchServers(search)}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  serverItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  serverName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  serverDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  serverMeta: {
    fontSize: 12,
    color: '#999',
  },
});