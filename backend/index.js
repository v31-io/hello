import morgan from 'morgan';
import cors from 'cors';
import express from 'express';
import { createClient } from '@redis/client';

import { config } from 'dotenv';
config();

// Check redis connection
const redisCredentials = {
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST
  }
}

const client = await createClient(redisCredentials)
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

await client.lPush('hello:hello', Date.now().toString());
await client.disconnect();

const app = express()

app.use(cors())
app.use(morgan('combined'))

app.get('/api', (req, res) => {
  res.json([
    {
      "id":"1",
      "title":"Book Review: The Name of the Wind"
    },
    {
      "id":"2",
      "title":"Game Review: Pokemon Brillian Diamond"
    },
    {
      "id":"3",
      "title":"Show Review: Alice in Borderland"
    },
    {
      "id":"4",
      "title":"Lord of the rings"
    }
  ])
})

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})
