"use strict";

const bcrypt = require("bcrypt");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query(
    `INSERT INTO users (username, password, first_name, last_name, email, zip_code)
      VALUES ('testuser1', $1, 'test1', 'user1', 'testuser1@test.com', '94601'),
             ('testuser2', $2, 'test2', 'user2', 'testuser2@test.com', '94602')
      RETURNING username`,
    [
      await bcrypt.hash('password', BCRYPT_WORK_FACTOR),
      await bcrypt.hash('password', BCRYPT_WORK_FACTOR)
    ]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};