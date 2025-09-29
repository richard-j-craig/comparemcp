import { defineBackend } from '@aws-amplify/backend';
import { sayHello } from './functions/say-hello/resource';
import { data } from './data/resource';

defineBackend({
  sayHello,
  data
});
