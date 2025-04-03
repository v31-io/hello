import os from 'os'
import { createClient } from "@redis/client"

const redisCredentials = {
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
  },
}

const client = createClient(redisCredentials)

client.on('connect', async () => {
  console.log(`Connected to Redis from ${os.hostname()}.`)

  // Test connection
  await client.lPush("hello:connection_log", `${os.hostname()}:${new Date().toUTCString()}`);
  let value = await client.lRange("hello:connection_log", 0, 0);
  console.log(`Connection Test value from Redis: ${value}`);
})

client.on('error', err => console.log('Redis Client Error', err))

client.connect()

export default client