const express = require("express");
const router = express.Router();
const {
  getDataRoute,
  putDataRoute,
  deleteDataRoute,
} = require("../controllers/data");

/* router.route("/routes").get(getRoutes);

router.route("/number").get(getNextNumberDataRoute);
router.route("/places").get(getGooglePlaces);

router.route("/commits").get(getCommits); */

router.route("/").get(getDataRoute);
router.route("/").put(putDataRoute);
router.route("/").delete(deleteDataRoute);

module.exports = router;
