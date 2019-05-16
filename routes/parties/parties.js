const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/userModel");
const Party = require("../../models/partyModel");

//Show parties created by user
router.get("/parties/created", (req, res) => {
  let currentUserObjectId = [
    mongoose.Types.ObjectId(req.session.currentUser._id)
  ];
  //Also show guests of party
  User.findOne({ _id: currentUserObjectId })
    .populate({
      path: "created_parties",
      populate: {
        path: "guests"
      }
    })
    .then(result => {
      res.render("./parties/created", { user: result });
    })
    .catch(err => {
      res.send(err);
    });
});

//Show all planned parties
router.get("/parties/planned", (req, res) => {
  let currentUserObjectId = [
    mongoose.Types.ObjectId(req.session.currentUser._id)
  ];
  User.findOne({ _id: currentUserObjectId })
    .populate({
      path: "created_parties",
      populate: {
        path: "guests"
      }
    })
    .populate({
      path: "invited_parties",
      populate: {
        path: "guests"
      }
    })
    .then(result => {
      res.render("./parties/planned", { user: result });
    })
    .catch(err => {
      res.send(err);
    });
});

//Load possible guests in create-party form
router.get("/parties/create-one", (req, res) => {
  let hostId = [mongoose.Types.ObjectId(req.session.currentUser._id)];
  //User cannot add itself as a guest
  User.find({ _id: { $nin: hostId } }, (err, result) => {
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

//Render form where user can edit party
router.get("/parties/edit", (req, res) => {
  debugger
  let partyObjectId = mongoose.Types.ObjectId(req.query.id);
  Party
    .findOne({ _id: partyObjectId })
    .populate("guests")
    .then(party => {
      if (!party.guests) {
        party.guests = "none";
        User.find({})
          .then((guests) => {
            res.render("./parties/edit", {
              party: party,
              uninvitedGuests: guests
            });
          })
          .catch((err) => {
            res.send(err);
          });
      } else {
        let invitedGuestIds = party.guests.map((guest) => guest._id)

        //User can add/remove guests
        User.find({ _id: { $nin: invitedGuestIds } })
          .then((guests) => {
            res.render("./parties/edit", {
              party: party,
              invitedGuests: party.guests,
              uninvitedGuests: guests
            },
            );
          });
      }
    })
    .catch(err => {
      res.send(err)
    });
});

router.post("/parties/edit", (req, res) => {
  let partyObjectId = mongoose.Types.ObjectId(req.body.id);
  let { title, location, start_date, start_time, end_date, end_time, description, guests } = req.body;
  Party.updateOne({ _id: partyObjectId }, { $set: { title, location, start_date, start_time, end_date, end_time, description, guests } })
    .then((party) => {
      res.redirect("/parties/created");
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
