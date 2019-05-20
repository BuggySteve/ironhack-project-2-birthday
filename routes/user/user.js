const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const Party = require("../../models/partyModel");

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
router.post("/user/sign-in", (req, res, next) => {
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
            res.status(200).json({ message: "Logged in" })
          } else {
            res.status(401).json({ mesage: "Wrong credentials" })
          }
        });
      } else {
        res.status(401).json({ mesage: "Wrong credentials" })
      }
    })
    .catch(err => {
      res.status(500).json({ message: "An error Occured" });
      console.log(err);
    });
});

module.exports = router;