import { config } from "dotenv"
config()
import express from "express"
import { createServer } from "node:http"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import cookie from "./services/cookie.js"
import websocket from "./routes/ws.js"
import rootRouter from "./routes/root.js"
import redisClient from './services/redis.js'


const app = express()
const server = createServer(app)

app.use(cors())
app.use(morgan("combined"))
app.use(cookieParser())

app.use(cookie)
websocket(server, redisClient)

app.use("/", rootRouter)

server.listen(4000, () => {
  console.log("listening for requests on port 4000")
})
