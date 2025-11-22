// Runtime JS mirror of auth middleware for environments that execute source files directly.
// Keep logic in sync with auth.ts.

/**
 * Extract a token from either the Authorization header (Bearer) or x-api-key.
 * @param {import('express').Request} req
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const apiKey = req.headers['x-api-key'];
  return typeof apiKey === 'string' ? apiKey : Array.isArray(apiKey) ? apiKey[0] : undefined;
};

/**
 * Basic token authentication middleware.
 * @type {import('express').RequestHandler}
 */
export const authMiddleware = (req, res, next) => {
  const requiredToken = process.env.API_TOKEN;

  // If no token is configured, allow the request (useful for local/dev environments)
  if (!requiredToken) {
    return next();
  }

  const token = extractToken(req);
  if (token !== requiredToken) {
    return res.status(401).json({ success: false, message: 'Accès non autorisé' });
  }

  req.user = { isAdmin: token === process.env.ADMIN_TOKEN };
  next();
};

/**
 * Admin-only guard middleware.
 * @type {import('express').RequestHandler}
 */
export const adminMiddleware = (req, res, next) => {
  const adminToken = process.env.ADMIN_TOKEN;

  // If no admin token is configured, fall back to the auth middleware result
  if (!adminToken) {
    if (req.user?.isAdmin) {
      return next();
    }
    return res.status(403).json({ success: false, message: 'Accès administrateur requis' });
  }

  const token = extractToken(req);
  if (token !== adminToken) {
    return res.status(403).json({ success: false, message: 'Accès administrateur requis' });
  }

  req.user = { ...req.user, isAdmin: true };
  next();
};

export default { authMiddleware, adminMiddleware };
