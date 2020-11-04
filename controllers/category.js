const Category = require("../models/category");
const { validationResult } = require("express-validator");

const fs = require("fs");
const path = require("path");

const ITEMS_PER_PAGE = 10;

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

exports.readAllCategory = (req, res, next) => {
  const page = +req.query.page;

  let totalItems;

  Category.find()
    .countDocuments()
    .then((numOfCategory) => {
      totalItems = numOfCategory;

      return Category.find();
    })
    .then((result) => {
      if (totalItems < 1) {
        res.status(404).json({
          status: 404,
          message: "Data Category belum ada",
          totalData: totalItems,
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "Data category berhasil didapatkan",
          totalData: totalItems,
          data: result,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.readCategoryById = (req, res, next) => {
  const id = req.params.id;

  Category.findById(id)
    .then((result) => {
      if (!result) {
        res.status(400).json({
          status: 400,
          message: "Category yang ada cari tidak ada",
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "Category by ID berhasil didapatkan",
          data: result,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.searchCategory = (req, res, next) => {
  const search = req.params.search;

  const regex = new RegExp(search, "i");

  let totalItems;

  // res.json({
  //   teks: search,
  // });

  Category.find({ name: regex })
    .countDocuments()
    .then((numOfSearch) => {
      totalItems = numOfSearch;

      return Category.find({ name: regex });
    })
    .then((result) => {
      if (totalItems < 1) {
        res.status(404).json({
          status: 400,
          message: "Category yang ada cari tidak ada",
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "Category by ID berhasil didapatkan",
          totalData: totalItems,
          data: result,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteCategory = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const id = req.params.id;

  Category.findById(id)
    .then((category) => {
      if (!category) {
        res.status(404).json({
          status: 404,
          message: "Category tersebut tidak ada",
        });
      } else {
        clearImage(category.image);
        return Category.findByIdAndRemove(id);
      }
    })
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Category berhasil dihapus",
      });
    });
};

exports.updateCategory = (req, res, next) => {
  const id = req.params.id;

  const image = req.file.path;
  const name = req.body.name;

  Category.findById(id)
    .then((category) => {
      if (!category) {
        res.status(404).json({
          status: 404,
          message: "Category tersebut tidak ada",
        });
      } else {
        if (category.image !== image) {
          clearImage(category.image);
        }
        category.name = name;
        category.image = image;

        return category.save();
      }
    })
    .then((result) => {
      res.status(201).json({
        status: 201,
        message: "Category berhasil diupdate",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
