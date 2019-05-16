const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partySchema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  start_date: { type: String, required: true },
  start_time: { type: String, required: true },
  end_date: { type: String, required: true },
  end_time: { type: String, required: true },
  description: { type: String, required: true },
  guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }]
});

let Party = mongoose.model("parties", partySchema);

module.exports = Party;
