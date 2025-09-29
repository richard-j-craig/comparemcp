import { defineBackend } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';

const mcpSearch = defineFunction({
  name: 'mcp-search',
  entry: './functions/mcp-search/handler.ts',
  environment: {
    GITHUB_API_KEY: process.env.GITHUB_API_KEY || ''
  }
});

const backend = defineBackend({
  mcpSearch
});

export default backend;