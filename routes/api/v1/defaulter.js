const express = require("express");
const router = express.Router();
const defaulterApi = require("../../../controllers/api/v1/defaulter");

router.get("/", defaulterApi.defaulter);

module.exports = router;
