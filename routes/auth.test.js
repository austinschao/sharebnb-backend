"use strict";

const app = require("../app");
const request = require("supertest");



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

/** POST /auth/token - returns { token: string } */
describe("POST /auth/token", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "testuser1",
        password: "password"
      });
    expect(resp.body).toEqual({
      token: expect.any(String)
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "fakeuser",
        password: "fakepassword"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "testuser2",
        password: "badpassword"
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "testuser3"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: 100,
        password: 100
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/** POST /auth/register - returns { token: string } */
describe("POST /auth/register", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser4",
        password: "password",
        firstName: "test4",
        lastName: "user4",
        email: "testuser4@test.com",
        zipCode: "94604"
      });
    expect(resp.body).toEqual({
      token: expect.any(String)
    });
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "testuser5",
        password: "password"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: 500,
        password: "password",
        firstName: "test5",
        lastName: "user5",
        email: "testuser5@test.com",
        zipCode: "94605"
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with duplicate username", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "testuser2",
        password: "password",
        firstName: "test2",
        lastName: "user2",
        email: "testuser2@test.com",
        zipCode: "94602"
      });
    expect(resp.statusCode).toEqual(400);
  });
});