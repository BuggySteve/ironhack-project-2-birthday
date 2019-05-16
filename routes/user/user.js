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

//Create user profile
router.get("/user/sign-up", (req, res) => {
  res.render("./elements/signUpForm");
});

router.post("/user/sign-up", (req, res) => {
  let newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    date_of_birth: req.body.date_of_birth
  };
  if (req.body.password !== req.body.passwordcheck) {
    res.send("Passwords aren't the same");
  } else {
    User.find({ username: req.body.username })
      .then(user => {
        if (user.length > 0) {
          res.send("User already exists"); //add new route here
        } else {
          bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) throw new Error("hashing error");
            else {
              newUser.password = hash;
              User.create(newUser).then(user => {
                res.redirect("/");
              });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send("An error Occured");
      });
  }
});

//User sign in
router.post("/user/log-in", (req, res, next) => {
  User.find({ username: req.body.username })
    .then(user => {
      if (user.length > 0) {
        bcrypt.compare(req.body.password, user[0].password, function (
          err,
          same
        ) {
          // same == true
          if (same) {
            delete user[0].password;
            req.session.currentUser = user[0];
            res.redirect("/user/dashboard");
          } else {
            res.redirect("/");
          }
        });
      } else {
        res.redirect("/");
      }
    })
    .catch(err => {
      res.status(500).send("An error Occured");
      console.log(err);
    });
});

//User sign out
router.get("/user/sign-out", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

module.exports = router;
