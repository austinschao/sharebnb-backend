const express = require("express");
const db = require("../db");
const User = require("../models/user");
const router = new express.Router();

/** Get /users: get a list of all users */
router.get("/", async function (req, res) {
  const users = await User.getAll();
  return res.json({ users });
});

module.exports = router;