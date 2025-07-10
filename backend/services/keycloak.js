import jwt from 'jsonwebtoken'


const clientId = process.env.KEYCLOAK_CLIENT_ID
const jwksCache = new Map()

function certToPEM(cert) {
  let pem = cert.match(/.{1,64}/g).join('\n');
  pem = `-----BEGIN CERTIFICATE-----\n${pem}\n-----END CERTIFICATE-----\n`;
  return pem;
}

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

function keycloakSocket(roles = []) {
  return (req, res, next) => {
    // Only check handshake, not packet requests
    const isHandshake = req._query.sid === undefined;
    if (!isHandshake) {
      return next();
    }

    // Try to get token from headers or from Socket.IO handshake auth
    let authHeader = req.headers['authorization'];
    if (!authHeader && req._query && req._query.token) {
      authHeader = `Bearer ${req._query.token}`;
    }

    if (!authHeader) {
      const err = new Error('Authorization header missing');
      err.data = { code: 'AUTH_MISSING', message: 'Authorization header missing' };
      return next(err);
    }
    
    const token = authHeader.split(' ')[1];
    jwt.verify(token, getKey, { algorithms: ['RS256'], ignoreExpiration: false }, (err, decoded) => {
      if (err) {
        const errorMsg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        const error = new Error(errorMsg);
        error.data = { code: err.name, message: errorMsg };
        return next(error);
      }
      const resourceAccess = decoded.resource_access || {};
      const userRoles = (resourceAccess[clientId] && resourceAccess[clientId].roles) || [];
      for (const role of roles) {
        if (!userRoles.includes(role)) {
          const error = new Error(`Role [${role}] is required.`);
          error.data = { code: 'ROLE_REQUIRED', message: `Role [${role}] is required.` };
          return next(error);
        }
      }
      req.user = decoded;
      next();
    });
  };
}


export { keycloak, keycloakSocket }