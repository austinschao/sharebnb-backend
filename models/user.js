"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");

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
      `SELECT username, password, first_name AS "firstName",  last_name AS "lastName", email, zip_code AS "zipCode"
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
    throw new UnauthorizedError("Invalid username/password.");
  }

  /** Register a new user.
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
      throw new BadRequestError(`Duplicate username: ${username}.`);
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, zip_code)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING username, first_name AS "firstName", last_name AS "lastName", email, zip_code AS "zipCode"`,
      [username, hashedPassword, firstName, lastName, email, zipCode]
    );
    return result.rows[0];
  }

  /**
   * Gets all users
   * Returns [{user}, {user}, ...]
   */
  static async getAll() {
    const results = await db.query(
      `SELECT username, first_name AS "firstName", last_name AS "lastName", email, zip_code AS "zipCode"
        FROM users`
    );
    if (results.rows.lnegth === 0) throw new NotFoundError("No users found");
    const users = results.rows;
    return users;
  }

  /** Given a username, return data about a user.
   *  Returns {username, first_name, last_name, email, zip_code}.
   *  Throws NotFoundError if user is not found.
  */
  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name AS "firstName", last_name AS "lastName", email, zip_code AS "zipCode"
        FROM users
        WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (user === undefined) throw new NotFoundError("Username not found.");
    return user;
  }

  /** Update a user's profile, return the updated data about the user.
   *  Returns {username, first_name, last_name, email, zip_code}.
   *  Throws NotFoundError if given user is not found.
   */
  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const jsToSql = {
      firstName: 'first_name',
      lastName: 'last_name',
      zipCode: 'zip_code'
    };

    const { setCols, values } = sqlForPartialUpdate(data, jsToSql);
    const usernameIdx = values.length + 1;

    const result = await db.query(
      `UPDATE users
      SET ${setCols}
      WHERE username = $${usernameIdx}
      RETURNING username, first_name AS "firstName", last_name AS "lastName", email, zip_code AS "zipCode"`,
      [...values, username]
    );
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
    return user;
  }

  /** Delete given user from database, returns undefined. */
  static async remove(username) {
    const result = await db.query(
      `DELETE FROM users
        WHERE username = $1
        RETURNING username`,
      [username]
    );
    const user = result.rows[0];
    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;