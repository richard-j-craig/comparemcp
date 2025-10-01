import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { sayHello } from './functions/say-hello/resource';
import { listMcpServers } from './functions/list-mcp-servers/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  data,
  sayHello,
  listMcpServers,
});
