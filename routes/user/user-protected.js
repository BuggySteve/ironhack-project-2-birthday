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

router.get("/user/edit", (req, res) => {
  let userObjectId = mongoose.Types.ObjectId(req.query.id);
  User.findOne({ _id: userObjectId })
    .then((user) => {
      res.render("./user/edit", { user: user })
    });
});

router.post("/user/edit", (req, res) => {
  let userObjectId = mongoose.Types.ObjectId(req.body.id);
  let { first_name, last_name, date_of_birth, email, username } = req.body;
  User.updateOne({ _id: userObjectId }, { $set: { first_name, last_name, date_of_birth, email, username } })
    .then(() => {
      req.session.destroy(err => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

//User sign out
router.get("/user/sign-out", (req, res) => {
  req.session.destroy(err => {
    res.redirect("/");
  });
});

module.exports = router;
