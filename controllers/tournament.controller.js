const District = require("../models/District.model");
const Game = require("../models/Game.model");
const Tournament = require("../models/Tournament.model");

class tournamentController {
  static viewImageTournament(req, res, next) {
    const { tournamentId } = req.params;
    Tournament.findById(tournamentId)
      .then((tournament) => {
        console.log(tournament.image);
        if (tournament.image) {
          res.set("Content-Type", tournament.image.contentType);
          return res.send(tournament.image);
        }
      })
      .catch(next);
  }

  static detailTournament(req, res, next) {
    const { permalink } = req.params;
    Tournament.findOne({ permalink: permalink })
    .populate("districts")
      .then((tournament) => {
        res.status(200).json(
          tournament
        );
      })
      .catch(next);
  }

  static async getTournamentAll(req, res, next) {
    Tournament.find()
    .sort({ tournament_name: 1 })
      .populate("districts")
      .then((tournament) => {
        res.status(200).json(tournament);
      })
      .catch(next);
  }

  static async tournamentAll(req, res, next) {
    console.log("coba");
    const { page = 1, limit = 10, q = "" } = req.query;
    const url_local = "http://localhost:8080";
    try {
      const tournament = await Tournament.find({
        tournament_name: { $regex: q, $options: "i" },
      })
        .sort({ tournament_name: 1 })
        .populate("districts")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      console.log(tournament);
      const nextpage = parseInt(page) + parseInt("1");
      const previouspage = parseInt(page) - parseInt("1");
      const jumlahData = await Tournament.countDocuments({
        tournament_name: { $regex: q, $options: "i" },
      });
      const jumlahPage = Math.ceil(jumlahData / limit);
      var npg, ppg;
      if (parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1) {
        npg = null;
        ppg = null;
      } else if (parseInt(page) === parseInt(jumlahPage)) {
        ppg = url_local + "/tournament/all?page=" + previouspage;
        npg = null;
      } else if (parseInt(page) === 1) {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = null;
      } else {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = url_local + "/tournament/all?page=" + previouspage;
      }
      res.status(200).json({
        tournament,
        page: page,
        totalpage: jumlahPage,
        nextpages: npg,
        previouspages: ppg,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  static filterGame(req, res, next) {
    const { gameF } = req.params;
    console.log("gameF", gameF);
    Tournament.find({ game: gameF })
    .sort({ tournament_name: 1 })
      .then((result) => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(next);
  }

  static filterDistricts(req, res, next) {
    const { districtsF } = req.params;
    // console.log("districtsF", typeof districtsF);
    Tournament.find({ districts: districtsF })
    .sort({ tournament_name: 1 })
      .populate("districts")
      .then((result) => {
        // console.log(result);
        res.status(200).json(result);
      })
      .catch(next);
  }

  static filterTournamentPending(req, res, next) {
    Tournament.find({ is_started: "pending" })
    .sort({ tournament_name: 1 })
      .$where("this.register_total_participant < this.max_total_participant")
      .populate("districts")
      .then((result) => {
        // console.log(result);
        res.status(200).json(result);
      })
      .catch(next);
  }

  //   static async filterTournamentPending(req, res, next) {
  //     console.log("coba");
  //     const { page = 1, limit = 10, q = "" } = req.query;
  //     const url_local = "http://localhost:8080";
  //     try {
  //       const tournament = await Tournament.find({ is_started: "pending" })
  //         .sort({ tournament_name: 1 })
  //         .$where("this.register_total_participant < this.max_total_participant")
  //         .populate("districts")
  //         .limit(limit * 1)
  //         .skip((page - 1) * limit)
  //         .exec();

  //       console.log(tournament);
  //       const nextpage = parseInt(page) + parseInt("1");
  //       const previouspage = parseInt(page) - parseInt("1");
  //       const jumlahData = await Tournament.countDocuments({
  //         tournament_name: { $regex: q, $options: "i" },
  //       });
  //       const jumlahPage = Math.ceil(jumlahData / limit);
  //       var npg, ppg;
  //       if (parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1) {
  //         npg = null;
  //         ppg = null;
  //       } else if (parseInt(page) === parseInt(jumlahPage)) {
  //         ppg = url_local + "/tournament/all?page=" + previouspage;
  //         npg = null;
  //       } else if (parseInt(page) === 1) {
  //         npg = url_local + "/tournament/all?page=" + nextpage;
  //         ppg = null;
  //       } else {
  //         npg = url_local + "/tournament/all?page=" + nextpage;
  //         ppg = url_local + "/tournament/all?page=" + previouspage;
  //       }
  //       res
  //         .status(200)
  //         .json({
  //           tournament,
  //           page: page,
  //           totalpage: jumlahPage,
  //           nextpages: npg,
  //           previouspages: ppg,
  //         });
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   }

  static async filterTournamentOngoing(req, res, next) {
    console.log("coba");
    const { page = 1, limit = 10, q = "" } = req.query;
    const url_local = "http://localhost:8080";
    try {
      const tournament = await Tournament.find({ is_started: "ongoing" })
        .sort({ tournament_name: 1 })
        .populate("districts")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      console.log(tournament);
      const nextpage = parseInt(page) + parseInt("1");
      const previouspage = parseInt(page) - parseInt("1");
      const jumlahData = await Tournament.countDocuments({
        tournament_name: { $regex: q, $options: "i" },
      });
      const jumlahPage = Math.ceil(jumlahData / limit);
      var npg, ppg;
      if (parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1) {
        npg = null;
        ppg = null;
      } else if (parseInt(page) === parseInt(jumlahPage)) {
        ppg = url_local + "/tournament/all?page=" + previouspage;
        npg = null;
      } else if (parseInt(page) === 1) {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = null;
      } else {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = url_local + "/tournament/all?page=" + previouspage;
      }
      res.status(200).json({
        tournament,
        page: page,
        totalpage: jumlahPage,
        nextpages: npg,
        previouspages: ppg,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  static async filterTournamentCompleted(req, res, next) {
    console.log("coba");
    const { page = 1, limit = 10, q = "" } = req.query;
    const url_local = "http://localhost:8080";
    try {
      const tournament = await Tournament.find({ is_started: "completed" })
        .sort({ tournament_name: 1 })
        .populate("districts")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      console.log(tournament);
      const nextpage = parseInt(page) + parseInt("1");
      const previouspage = parseInt(page) - parseInt("1");
      const jumlahData = await Tournament.countDocuments({
        tournament_name: { $regex: q, $options: "i" },
      });
      const jumlahPage = Math.ceil(jumlahData / limit);
      var npg, ppg;
      if (parseInt(page) === parseInt(jumlahPage) && parseInt(page) === 1) {
        npg = null;
        ppg = null;
      } else if (parseInt(page) === parseInt(jumlahPage)) {
        ppg = url_local + "/tournament/all?page=" + previouspage;
        npg = null;
      } else if (parseInt(page) === 1) {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = null;
      } else {
        npg = url_local + "/tournament/all?page=" + nextpage;
        ppg = url_local + "/tournament/all?page=" + previouspage;
      }
      res.status(200).json({
        tournament,
        page: page,
        totalpage: jumlahPage,
        nextpages: npg,
        previouspages: ppg,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  static getAllDistrict(req, res, next){
    District.find()
    .then((data) => {
        res.status(200).json(data);
    })
    .catch(next);
  }

  static getAllGame(req, res, next){
    Game.find()
    .sort({ game_name: 1 })
    .then((data) => {
        res.status(200).json(data);
    })
    .catch(next);
  }

}

module.exports = tournamentController;
