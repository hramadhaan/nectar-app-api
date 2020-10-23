const express = require("express");
const multer = require("multer");
const fs = require("fs");
const moment = require("moment");
const { body, param } = require("express-validator");

const Auth = require("../models/auth");

const router = express.Router();

const authController = require("../controllers/auth");
const authentication = require("../middleware/authentication");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("assets/profile")) {
      fs.mkdirSync("assets/profile");
    }
    cb(null, "assets/profile");
  },
  filename: (req, file, cb) => {
    cb(null, moment().format("dddd-MM-yyyy") + " - " + file.originalname);
  },
});

router.post(
  "/register",
  [
    multer({ storage: fileStorage }).single("avatar"),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return Auth.findOne({ email: value }).then((auth) => {
          if (auth) {
            return Promise.reject("E-mail address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email").trim().not().isEmpty(),
    body("password").trim().not().isEmpty(),
  ],
  authController.login
);

router.get("/profile/:id", [authentication], authController.profile);

router.get("/all-user", [authentication], authController.getAllUser);

module.exports = router;
