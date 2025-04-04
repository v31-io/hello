# Hello Chat

A simple chat application using NodeJS, socket.io and redis.
This is a docker compose application with components -

- frontend - Made using [Vue](https://vuejs.org/).

- backend - Made using express and [socket.io](https://socket.io/) for websocket communication.

- nginx - Reverse proxy to have a single server for the frontend and backend components. Config is in [nginx.conf](nginx.conf).

- redis - Socket.io [redis adapter](https://socket.io/docs/v4/redis-adapter/) is used with pub/sub to relay chat messages across multiple instances. Redis is not a part of the `docker-compose.yml` and an external service is used with a user having ACL like -
  ```config
  user hello on #${REDIS_USER_HELLO_PASSWORD_HASH} -@all +@connection +@read +@write +@pubsub ~hello:* &hello:* &hello:socket.io#/#*`
  ```
  The `&hello:socket.io#/#*` channel is what is required by the redis adapter.
  Redis password hash can be generated in bash like -
  ```bash
  REDIS_PASSWORD_HASH=$(echo -n "$REDIS_PASSWORD"} | sha256sum | head -c 64)
  ```

## Local Development

A `.devcontainer` configuration is enabled which provides a docker environment.
Maintain the redis credentials in the `sample.env` file (rename it to `.env`). And then run - 
```
docker compose up --build
``` 
Watch and local development parameters are enabled in the `docker-compose.override.yml` file. The applciation is served on `http://localhost:80`.