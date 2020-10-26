const Product = require("../models/product");

const fs = require("fs");
const path = require("path");

const ITEMS_PER_PAGE = 10;

const deleteImages = (files, cb) => {
  var i = files.length;

  files.forEach((filepath) => {
    fs.unlink(filepath, (err) => {
      i--;
      if (err) {
        cb(err);
        return;
      } else if (i <= 0) {
        cb(null);
      }
    });
  });
};

exports.addProduct = (req, res, next) => {
  if (!req.files) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const images = req.files;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const size = req.body.size;
  const category = req.body.categoryId;

  const pathImages = images.map((file) => file.path);

  const product = new Product({
    name: name,
    images: pathImages,
    price: price,
    description: description,
    size: size,
    category: category,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        status: 201,
        message: "Product berhasil ditambahkan",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllProduct = (req, res, next) => {
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numOfProducts) => {
      totalItems = numOfProducts;
      return Product.find()
        .populate("category", "_id name")
        .sort({ createdAt: -1 });
    })
    .then((result) => {
      if (totalItems < 1) {
        res.status(404).json({
          status: 404,
          message: "Data tidak ada",
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "Berhasil mendapatkan data product",
          data: result,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.productById = (req, res, next) => {
  const id = req.params.id;

  Product.findById(id)
    .populate("category", "_id name")
    .then((result) => {
      if (!result) {
        res.status(404).json({
          status: 404,
          message: "Product ID tidak ada",
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "Berhasil mendapatkan product by id",
          data: result,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.id;

  Product.findById(id)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          status: 404,
          message: "Product tidak ditemukan",
        });
      } else {
        deleteImages(product.images, (err) => {
          if (err) {
            console.log(err);
            return;
          } else {
            console.log("Has been removed");
          }
        });
        return Product.findByIdAndRemove(id);
      }
    })
    .then(() => {
      res.status(200).json({
        status: 200,
        message: "Product berhasil dihapus",
      });
    })
    .catch((err) => console.log(err));
};

exports.updateProduct = (req, res, next) => {
  const id = req.params.id;

  const images = req.files;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const size = req.body.size;
  const category = req.body.categoryId;

  var pathImages = images.map((image) => image.path);

  Product.findById(id)
    .then((prod) => {
      if (!prod) {
        const error = new Error("Could not find post");
        error.statusCode = 400;
        throw error;
      }
      prod.name = name;
      prod.price = price;
      prod.description = description;
      prod.size = size;
      prod.category = category;
      prod.images = pathImages;

      return prod.save();
    })
    .then((result) => {
      res.status(201).json({
        status: 201,
        message: "Product berhasil di update",
        data: result,
      });
    })
    .catch((err) => console.log(err));
};
