const { strict } = require("assert");
const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
  // roles: {type:  mongoose.Schema.Types.ObjectId, ref: "Role"},
  role_name: { type: String, enum: ["admin", "lurah", "panitia", "peserta"] },
  username: String,
  email: String,
  password: String,
  old_password: {data: String, default: ""},
  birthdate: Date,
  phone: String,
  status: {type:Boolean},
  tournament_register: {type: mongoose.Schema.Types.ObjectId, ref: "Tournament"},
  tournament_approved: {type: mongoose.Schema.Types.ObjectId, ref: "TournamentApproved"}, 
  districts: {type: String, ref: "District"},
  teams: {type: String, ref: "Team"},
  
});

const User = mongoose.model("User", userSchema);
module.exports = User;