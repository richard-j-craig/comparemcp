import { type ClientSchema, a, defineData } from "@aws-amplify/backend"
import { listMcpServers } from "../functions/list-mcp-servers/resource"

const schema = a.schema({
  listMcpServers: a
    .query()
    .arguments({
      searchTerm: a.string(),
    })
    .returns(a.string())
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function(listMcpServers)),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
})