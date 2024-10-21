"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");


const router = express.Router();

/** POST /token: {username, password} => { token } */

router.post("/login", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    console.log("Login request body:", req.body);
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    console.log("Generated token:", token);
    return res.json({token});
  } catch (error) {
    console.error("Login error:", error);
    return next(error);
  }
});

/** POST /signup: { user }  => { token } **/

router.post("/signup", async function (req, res, next) {
  try {
    const {username, password, firstName, lastName, email } = req.body;
    const newUser = await User.register({
      username, password, firstName, lastName, email, isAdmin:false
    });
    const token = createToken(newUser);
    console.log("Generated Token:", token);
    return res.json({token});
  } catch (error) {
    return next(error);
  }
  });

  router.get("/:username", async function (req, res, next) {
    try {
      const username = req.params.username;
      const user = await User.get(username);
      if(!user) {
        return res.json({error: "User not found!"});
      }
      return res.json({user});
    } catch (error) {
      return next(error);
    }
  })

  module.exports = router;