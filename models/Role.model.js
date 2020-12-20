const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
  role_name: { type: String, enum: ["admin", "lurah", "panitia", "peserta"] },
});

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
