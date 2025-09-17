import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';

const mockMcpServers = [
  { id: '1', name: 'filesystem-mcp', description: 'File system operations MCP server' },
  { id: '2', name: 'github-mcp', description: 'GitHub API MCP server' },
  { id: '3', name: 'sqlite-mcp', description: 'SQLite database MCP server' },
];

export default function App() {
  const renderServer = ({ item }) => (
    <View style={styles.serverItem}>
      <Text style={styles.serverName}>{item.name}</Text>
      <Text style={styles.serverDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MCP Server Comparison</Text>
      <FlatList
        data={mockMcpServers}
        renderItem={renderServer}
        keyExtractor={(item) => item.id}
        style={styles.list}
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
  },
});