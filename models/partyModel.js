const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partySchema = new Schema({
  title: { type: String },
  location: { type: String },
  start_date: { type: String },
  start_time: { type: String },
  end_date: { type: String },
  end_time: { type: String },
  description: { type: String },
  guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
});

let Party = mongoose.model("parties", partySchema);

module.exports = Party;
