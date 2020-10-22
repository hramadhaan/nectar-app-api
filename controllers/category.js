const Category = require("../models/category");

const fs = require("fs");
const path = require("path");

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.addCategory = (req, res, next) => {
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const image = req.file.path;
  const name = req.body.name;

  const category = new Category({
    name: name,
    image: image,
  });

  category
    .save()
    .then((result) => {
      res.status(201).json({
        status: 201,
        message: "Category berhasil ditambahkan",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
