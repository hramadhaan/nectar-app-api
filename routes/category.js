const express = require("express");
const multer = require("multer");
const fs = require("fs");
const moment = require("moment");
const { body, param } = require("express-validator");

const categoryController = require("../controllers/category");
const authentication = require("../middleware/authentication");
const Category = require("../models/category");

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
    cb(null, moment().format("DD-MM-yyyy LTS") + " - " + file.originalname);
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

router.get(
  "/all-category",
  [authentication],
  categoryController.readAllCategory
);

router.get("/:id", [authentication], categoryController.readCategoryById);

router.get(
  "/search-category/:search",
  authentication,
  categoryController.searchCategory
);

router.get(
  "/delete-category/:id",
  [
    authentication,
    param("id").custom((value, { req }) => {
      return Category.findOne({ _id: value }).then((category) => {
        if (!category) {
          return Promise.reject("Id tidak ditemukan");
        }
      });
    }),
  ],
  categoryController.deleteCategory
);

router.post(
  "/update-category/:id",
  [authentication, multer({ storage: fileStorage }).single("image")],
  categoryController.updateCategory
);

module.exports = router;
