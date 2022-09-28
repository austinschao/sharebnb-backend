"use strict";

const db = require("../db");
const User = require("../models/user");
const { createToken } = require("../helpers/token");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");

  await User.register({
    username: "testuser1",
    password: "password",
    firstName: "test1",
    lastName: "user1",
    email: "testuser1@test.com",
    zipCode: "94601"
  });

  await User.register({
    username: "testuser2",
    password: "password",
    firstName: "test2",
    lastName: "user2",
    email: "testuser2@test.com",
    zipCode: "94602"
  });

  await User.register({
    username: "testuser3",
    password: "password",
    firstName: "test3",
    lastName: "user3",
    email: "testuser3@test.com",
    zipCode: "94603"
  });
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
  commonAfterAll,
  commonBeforeEach,
  commonAfterEach
};