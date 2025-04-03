// Set a sessionID cookie which will be used by nginx reverse proxy load balancer for sticky sessions

export default function cookie(req, res, next) {
  if (req.cookies.sessionID === undefined) {
    const randomNumber = Math.random().toString()
    const sessionID = randomNumber.substring(2, randomNumber.length)
    res.cookie("sessionID", sessionID, { maxAge: 900000, httpOnly: true })
    console.log(`Cookie ${sessionID} created`)
  }

  next()
}
