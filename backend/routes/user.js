import express from "express"
const router = express.Router()


router.get("/", (req, res) => {
  res.json(req.kauth.grant.access_token.content)
})


export default router