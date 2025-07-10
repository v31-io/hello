import { config } from "dotenv"
config()
import express from "express"
import { createServer } from "node:http"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import { keycloak, keycloakSocket } from "./services/keycloak.js"
import websocket from "./routes/ws.js"
import rootRouter from "./routes/root.js"
import userRouter from "./routes/user.js"


const app = express()
const server = createServer(app)

app.use(cors())
app.use(morgan("combined"))
app.use(cookieParser())

websocket(server, keycloakSocket(['access']))

app.use("/", rootRouter)
app.use("/user", keycloak(['access']), userRouter)

server.listen(4000, () => {
  console.log("listening for requests on port 4000")
})
