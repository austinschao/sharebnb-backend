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
});