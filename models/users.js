"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

/** Related functions for users. */

class User {

  /** Authenticate the user's login information.
   *  Returns {username, first_name, last_name, email, zip_code}.
   *  Throws UnauthorizedError if user is not found or wrong credentials are provided.
  */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username, password, first_name,  last_name, email, zip_code
        FROM users
        WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (user) {
      if (await bcrypt.compare(password, user.password) === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register a new user
   *  Returns {username, first_name, last_name, email, zip_code}.
   *  Throws BadRequestError on duplicates.
   */
  static async register({ username, password, firstName, lastName, email, zipCode }) {
    const duplicateCheck = await db.query(
      `SELECT username
        FROM users
        WHERE username = $1`,
      [username]
    );
    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, zip_code)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [username, hashedPassword, firstName, lastName, email, zipCode]
    );

  }
}