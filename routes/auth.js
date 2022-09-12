"use strict";

const express = require("express");
const jsonschema = require("jsonschema");
const router = new express.Router();
const { createToken } = require("../helpers/token");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { json } = require("express");

/** POST /auth/token: { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests
 *
 * Authorization required: none
 */
router.post("/token", async function (req, res) {
  const validator = jsonschema.validate(req.body, userAuthSchema);
  if (validator.valid === false) {
    const errors = validator.errors.map(e => e.stack);
    throw new BadRequestError(errors);
  }

  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  const token = createToken(user);
  return res.json({ token });
});

/** POST /auth/register: { username, password, firstName, lastName, email, zipCode}
 *
 * Registers a new user and returns a JWT.
 *
 * Authorization required: none
*/
router.post("/register", async function (req, res) {
  const validator = jsonschema.validate(req.body, userRegisterSchema);
  if (validator.valid === false) {
    const errors = validator.errors.map(e => e.stack);
    throw new BadRequestError(errors);
  }

  const newUser = await User.register(req.body);
  const token = createToken(newUser);
  return res.status(201).json({ token });
});

module.exports = router;