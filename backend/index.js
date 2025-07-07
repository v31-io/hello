import { config } from "dotenv"
config()
import express from "express"
import session from "express-session"
import { createServer } from "node:http"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import getKeycloak from "./services/keycloak.js"
import websocket from "./routes/ws.js"
import rootRouter from "./routes/root.js"
import userRouter from "./routes/user.js"


const app = express()
const server = createServer(app)

const memoryStore = new session.MemoryStore()
app.use(session({
  secret: 'hello-chat',
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}))

const keycloak = getKeycloak(memoryStore)
app.use(keycloak.middleware())
app.use(cors())
app.use(morgan("combined"))
app.use(cookieParser())

websocket(server)

app.use("/", rootRouter)
app.use("/user", keycloak.protect(), userRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  })
})

server.listen(4000, () => {
  console.log("listening for requests on port 4000")
})
