const express = require("express");
const multer = require("multer");
const fs = require("fs");
const moment = require("moment");
const { body } = require("express-validator");

const Category = require("../models/category");

const categoryController = require("../controllers/category");
const authentication = require("../middleware/authentication");

const pathStorage = "assets/category";

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(pathStorage)) {
      fs.mkdirSync(pathStorage);
    }
    cb(null, pathStorage);
  },
  filename: (req, file, cb) => {
    cb(null, moment().format("dddd-MM-yyyy") + " - " + file.originalname);
  },
});

router.post(
  "/add-category",
  [
    multer({ storage: fileStorage }).single("image"),
    body("name").trim().not().isEmpty(),
    authentication,
  ],
  categoryController.addCategory
);

module.exports = router;
