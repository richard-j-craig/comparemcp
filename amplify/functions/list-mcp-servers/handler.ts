import type { Schema } from "../../data/resource"

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
}

interface McpServer {
  name: string;
  description: string;
  link: string;
  stars: number;
  lastUpdated: string;
}

export const handler: Schema["listMcpServers"]["functionHandler"] = async (event) => {
  const { searchTerm } = event.arguments;

  try {
    // Search for MCP server repositories on GitHub
    const searchQuery = searchTerm
      ? `mcp server ${searchTerm} in:name,description,readme`
      : 'mcp server in:name,description,readme';

    const response = await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=20`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MCP-Server-Directory'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    const servers: McpServer[] = data.items.map((repo: GitHubRepo) => ({
      name: repo.name,
      description: repo.description || 'No description available',
      link: repo.html_url,
      stars: repo.stargazers_count,
      lastUpdated: repo.updated_at
    }));

    return JSON.stringify(servers);
  } catch (error) {
    console.error('Error fetching MCP servers:', error);

    // Return fallback data if GitHub API fails
    const fallbackServers: McpServer[] = [
      {
        name: "modelcontextprotocol/servers",
        description: "Official Model Context Protocol servers repository",
        link: "https://github.com/modelcontextprotocol/servers",
        stars: 0,
        lastUpdated: new Date().toISOString()
      }
    ];

    return JSON.stringify(fallbackServers);
  }
}

