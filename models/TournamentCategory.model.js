const mongoose = require ("mongoose");
const tournamentCategorySchema = new mongoose.Schema({
    category_name: String
});
const TournamentCategory = mongoose.model("TounamentCategory", tournamentCategorySchema);
module.exports = TournamentCategory;