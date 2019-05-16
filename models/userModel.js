const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date_of_birth: { type: String, required: true },
  created_parties: [{ type: mongoose.Schema.Types.ObjectId, ref: "parties" }],
  invited_parties: [{ type: mongoose.Schema.Types.ObjectId, ref: "parties" }]
});

let User = mongoose.model("users", userSchema);

module.exports = User;
