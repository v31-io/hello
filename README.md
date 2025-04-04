# Hello Chat

A simple chat application using NodeJS, socket.io and redis.
This is a docker compose application with components -

- frontend - Made using [Vue](https://vuejs.org/).

- backend - Made using express and [socket.io](https://socket.io/) for websocket communication.

- nginx - Reverse proxy to have a single server for the frontend and backend components.

- redis - Socket.io [redis adapter](https://socket.io/docs/v4/redis-adapter/) is used with pub/sub to relay chat messages across multiple instances. Redis is not a part of the `docker-compose.yml` and an external service is used with a user having ACL like 
  ```
  user hello on #${REDIS_USER_HELLO_PASSWORD_HASH} -@all +@connection +@read +@write +@pubsub ~hello:* &hello:* &hello:socket.io#/#*`
  ```
  The `&hello:socket.io#/#*` part is what is required by the redis adapter.

## Local Development

Maintain the redis credentials in the `ssmple.env` file (rename it to `.env`). And then run `docker compose up --build`. Watch and local development parameters are enabled in the `docker-compose.override.yml` file. The applciation is served on `http://localhost:80`