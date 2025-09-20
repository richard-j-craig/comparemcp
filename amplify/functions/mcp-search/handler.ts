import type { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const query = event.queryStringParameters?.q || '';
    
    // GitHub API search for MCP servers
    const searchQuery = `mcp-server OR model-context-protocol ${query}`.trim();
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=50`;
    
    const headers: Record<string, string> = {};
    if (process.env.GITHUB_API_KEY) {
      headers['Authorization'] = `token ${process.env.GITHUB_API_KEY}`;
    }
    
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    // Filter and format results
    const servers = data.items?.map((repo: any) => ({
      id: String(repo.id),
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language || '',
      updated: repo.updated_at
    })) || [];
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ servers })
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: String(error) })
    };
  }
};