import os from 'os'
import { createClient } from "@redis/client"

const redisCredentials = (label) => ({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    reconnectStrategy: (attempts) => {
      console.log(`Redis client ${label} reconnecting attempt ${attempts + 1}...`)
      return 5000
    }
  }
})
  
export function getRedisClient (label = 'default') {  
  const client = createClient(redisCredentials(label))

  client.on('connect', async () => {
    console.log(`Client ${label} connected to Redis from ${os.hostname()}.`)
  
    // Test connection
    await client.lPush("hello:connection_log", `${os.hostname()}:${new Date().toUTCString()}`);
    let value = await client.lRange("hello:connection_log", 0, 0);
    console.log(`Client ${label} connection test value from Redis: ${value}`);
  })
  
  client.on('error', err => console.log(`Redis client ${label} error`, err))

  return client
}

const client = getRedisClient()
client.connect()

export default client