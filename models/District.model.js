const mongoose = require ("mongoose");
const districtSchema = new mongoose.Schema({
    district_name: String
});
const District = mongoose.model("District", districtSchema);
module.exports = District;