const express = require("express");
const multer = require("multer");
const fs = require("fs");
const moment = require("moment");

const authentication = require("../middleware/authentication");

const router = express.Router();

const productController = require("../controllers/product");

const pathStorage = "assets/product";

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

router.post("/add-product", [
  authentication,
  multer({ storage: fileStorage }).array("images", 4),
  productController.addProduct,
]);

router.get("/all-product", authentication, productController.getAllProduct);

router.get("/:id", authentication, productController.productById);

router.get(
  "/delete-product/:id",
  authentication,
  productController.deleteProduct
);

router.post(
  "/update-product/:id",
  authentication,
  productController.updateProduct
);

module.exports = router;
