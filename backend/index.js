import morgan from "morgan";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { createClient } from "@redis/client";

import { config } from "dotenv";
config();

// Check redis connection
const redisCredentials = {
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
  },
};

const client = await createClient(redisCredentials)
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

await client.lPush("hello:hello", Date.now().toString());
let value = await client.lRange("hello:hello", 0, 0);
console.log(`Value from Redis: ${value}`);
await client.disconnect(); 

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(cookieParser());

// set a cookie
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.sessionID;
  if (cookie === undefined) {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('sessionID',randomNumber, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully');
  } else {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  } 
  
  next();
});

app.get("/", (req, res) => {
  res.json([
    {
      id: "1",
      title: "Book Review: The Name of the Wind",
    },
    {
      id: "2",
      title: "Game Review: Pokemon Brillian Diamond",
    },
    {
      id: "3",
      title: "Show Review: Alice in Borderland",
    },
    {
      id: "4",
      title: "Lord of the rings",
    },
    {
      id: "5",
      title: "Harry Potter",
    },
  ]);
});

app.listen(4000, () => {
  console.log("listening for requests on port 4000");
});
