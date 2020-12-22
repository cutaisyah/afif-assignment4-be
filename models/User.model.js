const { strict } = require("assert");
const mongoose = require ("mongoose");
const validator = require("validator");


const userSchema = new mongoose.Schema({
  // roles: {type:  mongoose.Schema.Types.ObjectId, ref: "Role"},
  role_name: { type: String, enum: ["admin", "lurah", "panitia", "peserta"] },
  username: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Email address is required"],
    validate: [
      {
        validator: validator.isEmail,
      },
    ],
  },
  password: {
    type: String,
    required: [true, "Password is a required field"],
    minlength: 6,
    maxlength: 1000,
    validate: {
      validator: (e) => {
        e.toLowerCase() !== "password";
      },
    },
  },
  old_password: {type: String, default: ""},
  birthdate: Date,
  phone: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isMobilePhone,
      },
  },
  status: {type:Boolean},
  tournament_register: {type: mongoose.Schema.Types.ObjectId, ref: "Tournament"},
  tournament_approved: {type: mongoose.Schema.Types.ObjectId, ref: "TournamentApproved"}, 
  districts: {type: String, ref: "District"},
  teams: {type: String, ref: "Team"},
  
});

const User = mongoose.model("User", userSchema);
module.exports = User;