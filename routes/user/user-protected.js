const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const Party = require("../../models/partyModel");

//Show user dashboard
router.get("/user/dashboard", (req, res) => {
  res.render("./user/dashboard");
});

//Show user profile
router.get("/user/profile", (req, res) => {
  res.render("./user/profile");
});


//User sign out
router.get("/user/sign-out", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

module.exports = router;
