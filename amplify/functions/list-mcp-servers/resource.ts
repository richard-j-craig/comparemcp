import { defineFunction } from '@aws-amplify/backend';

export const listMcpServers = defineFunction({
  name: 'list-mcp-servers',
  entry: './handler.ts'
});

