import { type ClientSchema, a, defineData } from "@aws-amplify/backend"
import { sayHello } from "../functions/say-hello/resource"

const schema = a.schema({
  sayHello: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .authorization(allow => [allow.guest()])
    .handler(a.handler.function(sayHello)),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
})