const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/userModel");
const Party = require("../../models/partyModel");

//Show parties created by user
router.get("/parties/created", (req, res) => {
  debugger;
  let currentUserObjectId = [
    mongoose.Types.ObjectId(req.session.currentUser._id)
  ];
  User.findOne({ _id: currentUserObjectId })
    .populate("created_parties")
    .then(result => {
      res.render("./parties/created", { user: result });
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/parties/planned", (req, res) => {
  res.render("./parties/planned");
});

//Load possible guests in create-party form
router.get("/parties/create-one", (req, res) => {
  User.find({}, (err, result) => {
    res.render("./parties/createOne", { users: result });
  });
});

//Create new party in database with form data
router.post("/parties/create-one", (req, res) => {
  //User can select one or multiple guests
  if (Array.isArray(req.body.guests)) {
    var guestIds = req.body.guests.map(id => {
      return mongoose.Types.ObjectId(id);
    });
  } else {
    var guestIds = [mongoose.Types.ObjectId(req.body.guests)];
  }

  let newParty = {
    title: req.body.title,
    location: req.body.location,
    start_date: req.body.start_date,
    start_time: req.body.start_time,
    end_date: req.body.end_date,
    end_time: req.body.end_time,
    description: req.body.description,
    guests: guestIds
  };

  Party.create(newParty, (err, result) => {
    if (err) res.send("ERROR creating party");
    console.log(err);

    //Add party to invited users
    User.update(
      { _id: { $in: guestIds } },
      { $push: { invited_parties: result._id } },
      (err, result) => {
        if (err) {
          res.send("ERROR adding party to user profiles");
          console.log(err);
        }
      }
    );
    //Add party to hosting user
    let hostId = [mongoose.Types.ObjectId(req.session.currentUser._id)];
    User.updateOne(
      { _id: hostId },
      { $push: { created_parties: result._id } },
      (err, result) => {
        if (err) {
          res.send("ERROR adding party to host profile");
          console.log(err);
        } else res.redirect("/parties/created");
      }
    );
  });
});

module.exports = router;
