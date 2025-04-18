import Keycloak from 'keycloak-connect'


const keycloakConfig = {
  realm: 'default',
  clientId: 'hello-chat',
  bearerOnly: true,
  serverUrl: process.env.KEYCLOAK_URL
};

export default function getKeycloak(store) {
  return new Keycloak({ store }, keycloakConfig)
}