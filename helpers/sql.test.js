"use strict";

const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function () {
  test("works for valid data", function () {
    const dataToUpdate = { firstName: "test", lastName: "user", zipCode: "94605" };
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      zipCode: "zip_code"
    };
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(result).toEqual({
      setCols: "first_name=$1, last_name=$2, zip_code=$3",
      values: ["test", "user", "94605"]
    });
  });

  test("fails for no data", function () {
    const dataToUpdate = {};
    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      zipCode: "zip_code"
    };

    try {
      sqlForPartialUpdate(dataToUpdate, jsToSql);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});