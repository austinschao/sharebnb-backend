"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** Authenticate the user's login information */
describe("Authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("testuser1", "password");
    expect(user).toEqual({
      username: "testuser1",
      firstName: "test1",
      lastName: "user1",
      email: "testuser1@test.com",
      zipCode: "94601"
    });
  });

  test("unauth with bad username", async function () {
    try {
      await User.authenticate("fakeruser", "password");
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth with bad password", async function () {
    try {
      await User.authenticate("testuser2", "fakepassword");
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/** Registers a new user */
describe("Register", function () {
  test("works", async function () {
    const user = await User.register({
      username: "testuser3",
      firstName: "test3",
      password: "password",
      lastName: "user3",
      email: "testuser3@test.com",
      zipCode: "94603"
    });
    expect(user).toEqual({
      username: "testuser3",
      firstName: "test3",
      lastName: "user3",
      email: "testuser3@test.com",
      zipCode: "94603"
    });
  });

  test("bad request with duplicate username", async function () {
    try {
      await User.register({
        username: "testuser2",
        firstName: "test2",
        password: "password",
        lastName: "user2",
        email: "testuser2@test.com",
        zipCode: "94602"
      });
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/** Get all users */
describe("Get all users", function () {
  test("works", async function () {
    const users = await User.getAll();
    expect(users).toEqual([
      {
        username: "testuser1",
        firstName: "test1",
        lastName: "user1",
        email: "testuser1@test.com",
        zipCode: "94601"
      },
      {
        username: "testuser2",
        firstName: "test2",
        lastName: "user2",
        email: "testuser2@test.com",
        zipCode: "94602"
      }
    ]);
  });

  test("not found if no users exist", async function () {
    await db.query(`DELETE FROM users`);
    try {
      await User.getAll();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** Get a user */
describe("Get a user", function () {
  test("works", async function () {
    const user = await User.get("testuser1");
    expect(user).toEqual({
      username: "testuser1",
      firstName: "test1",
      lastName: "user1",
      email: "testuser1@test.com",
      zipCode: "94601"
    });
  });

  test("not found if username is invalid or doesn't exist", async function () {
    try {
      await User.get("fakeusername");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/** Updates a user */
describe("Updates a user", function () {
  test("works", async function () {
    const userToUpdate = "testuser1";
    const data = {
      firstName: "Test1",
      lastName: "User1",
      password: "Password"
    };
    const user = await User.update(userToUpdate, data);
    expect(user).toEqual({
      username: "testuser1",
      firstName: "Test1",
      lastName: "User1",
      email: "testuser1@test.com",
      zipCode: "94601"
    });
  });
});