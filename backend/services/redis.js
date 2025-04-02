import { createClient } from "@redis/client";

// Check redis connection
// const redisCredentials = {
//   username: process.env.REDIS_USER,
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     host: process.env.REDIS_HOST,
//   },
// }

// const client = await createClient(redisCredentials)
//   .on("error", (err) => console.log("Redis Client Error", err))
//   .connect();

// await client.lPush("hello:hello", Date.now().toString());
// let value = await client.lRange("hello:hello", 0, 0);
// console.log(`Value from Redis: ${value}`);
// await client.disconnect(); 