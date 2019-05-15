const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  date_of_birth: { type: String },
  created_parties: [{ type: mongoose.Schema.Types.ObjectId, ref: "parties" }],
  invited_parties: [{ type: mongoose.Schema.Types.ObjectId, ref: "parties" }]
});

let User = mongoose.model("users", userSchema);

module.exports = User;
