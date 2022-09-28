"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user.
 *  If a token was provided, verify it, and, if valid, store the token payload
 *  on res.locals (this will include the username).
 *
 *  It's not an error if no token was provided or if it wasn't valid.
 */
function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware: Ensure a user is logged in.
 *
 *  If not, throw an UnauthorizedError.
 */
function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware: Ensure user is authorized when making changes to their account.
 *
 * If not, throw an UnauthorizedError.
 */
function ensureAuthUser(req, res, next) {
  try {
    if (!res.locals.user || res.locals.user.username !== req.params.username) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next();
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAuthUser
};