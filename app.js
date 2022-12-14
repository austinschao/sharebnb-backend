"use strict";

/** Express app for ShareBnB. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

/** Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);



/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;