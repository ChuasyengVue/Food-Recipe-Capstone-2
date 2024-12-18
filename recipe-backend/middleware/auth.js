"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      const user = jwt.verify(token, SECRET_KEY);
      res.locals.user = user;
      console.log("Authenticated user:", user);
    }
    else{
      console.log("No authorization header found");
    }

    return next();
  } catch (err) {
    console.log("JWT authentication error:", err);
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header

  if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
  }

  try {
      const payload = jwt.verify(token, SECRET_KEY); // Verify the token
      res.locals.user = payload; // Store user data for the next middleware
      return next(); // Proceed to the next middleware/route handler
  } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
  }
}


/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUserOrAdmin(req, res, next) {
  try {
    const user = res.locals.user;
    if (!(user && (user.isAdmin || user.username === req.params.username))) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureCorrectUserOrAdmin,
};
