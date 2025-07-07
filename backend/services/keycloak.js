import jwt from 'jsonwebtoken'


function certToPEM(cert) {
  let pem = cert.match(/.{1,64}/g).join('\n');
  pem = `-----BEGIN CERTIFICATE-----\n${pem}\n-----END CERTIFICATE-----\n`;
  return pem;
}


const KEYCLOAK_CLIENT_ID = 'hello-chat'
const jwksCache = new Map()

async function loadJWKS() {
  const res = await fetch(`${process.env.KEYCLOAK_URL}/realms/default/protocol/openid-connect/certs`)
  if (!res.ok) throw new Error(`Failed to fetch JWKS: ${res.status}`)
  const { keys } = await res.json()
  for (const k of keys) {
    const pubKey = certToPEM(k.x5c[0])
    jwksCache.set(k.kid, pubKey)
  }
  console.log(`Loaded ${jwksCache.size} signing keys from Keycloak.`)
}
await loadJWKS()

function getKey(header, callback) {
  const signingKey = jwksCache.get(header.kid)
  if (!signingKey) {
    return callback(new Error(`Unknown kid: ${header.kid}`))
  }
  callback(null, signingKey)
}


function keycloak(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      return res.status(401).json({ detail: 'Authorization header missing' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, getKey, { algorithms: ['RS256'], ignoreExpiration: false }, (err, decoded) => {
      if (err) {
        return res.status(401).json({ detail: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' })
      }

      // Role check
      const clientId = KEYCLOAK_CLIENT_ID
      const resourceAccess = decoded.resource_access || {}
      const userRoles = (resourceAccess[clientId] && resourceAccess[clientId].roles) || []
      for (const role of roles) {
        if (!userRoles.includes(role)) {
          return res.status(401).json({ detail: `Role [${role}] is required.` })
        }
      }

      // Attach decoded token to request if needed
      req.user = decoded
      next()
    })
  }
}

export default keycloak