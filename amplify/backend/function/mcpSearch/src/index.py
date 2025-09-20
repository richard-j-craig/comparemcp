import json
import urllib.request
import urllib.parse
import os

def lambda_handler(event, context):
    try:
        query = event.get('queryStringParameters', {}).get('q', '')
        
        # GitHub API search for MCP servers
        search_query = f"mcp-server OR model-context-protocol {query}".strip()
        url = f"https://api.github.com/search/repositories?q={urllib.parse.quote(search_query)}&sort=stars&order=desc&per_page=50"
        
        headers = {}
        if os.environ.get('GITHUB_API_KEY'):
            headers['Authorization'] = f"token {os.environ['GITHUB_API_KEY']}"
        
        req = urllib.request.Request(url, headers=headers)
        
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
        
        # Filter and format results
        servers = []
        for repo in data.get('items', []):
            servers.append({
                'id': str(repo['id']),
                'name': repo['name'],
                'description': repo.get('description', ''),
                'url': repo['html_url'],
                'stars': repo['stargazers_count'],
                'language': repo.get('language', ''),
                'updated': repo['updated_at']
            })
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps({'servers': servers})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET,OPTIONS'
            },
            'body': json.dumps({'error': str(e)})
        }