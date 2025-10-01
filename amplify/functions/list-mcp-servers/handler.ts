import type { Schema } from "../../data/resource"

export const handler: Schema["listMcpServers"]["functionHandler"] = async (event) => {
  // Return a list of MCP servers with dummy data
  const servers = [
    {
      name: "GitHub MCP Server",
      description: "Access GitHub repositories, issues, and pull requests through MCP",
      link: "https://github.com/modelcontextprotocol/servers/tree/main/src/github"
    },
    {
      name: "Filesystem MCP Server",
      description: "Secure file operations with configurable access controls",
      link: "https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem"
    },
    {
      name: "PostgreSQL MCP Server",
      description: "Database operations and schema inspection for PostgreSQL",
      link: "https://github.com/modelcontextprotocol/servers/tree/main/src/postgres"
    },
    {
      name: "Slack MCP Server",
      description: "Read and send messages in Slack channels and DMs",
      link: "https://github.com/modelcontextprotocol/servers/tree/main/src/slack"
    },
    {
      name: "Google Drive MCP Server",
      description: "Search and read files from Google Drive",
      link: "https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive"
    },
    {
      name: "Puppeteer MCP Server",
      description: "Browser automation and web scraping capabilities",
      link: "https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer"
    }
  ];

  return JSON.stringify(servers);
}

