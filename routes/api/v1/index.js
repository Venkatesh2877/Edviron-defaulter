const express = require("express");
const router = express.Router();

router.use("/defaulter", require("./defaulter"));

module.exports = router;
