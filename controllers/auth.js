const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const Auth = require("../models/auth");

exports.register = (req, res, next) => {
  if (!req.file) {
    const error = new Error("No Image Provided");
    error.statusCode = 422;
    throw error;
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const name = req.body.name;
  const email = req.body.email;
  const avatar = req.file.path;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const auth = new Auth({
        name: name,
        avatar: avatar,
        email: email,
        password: hashedPw,
      });

      return auth.save();
    })
    .then((result) => {
      res.status(201).json({
        status: 201,
        message: "User berhasil ditambahkan",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const password = req.body.password;

  let dataUser;

  Auth.findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(404).json({
          status: 404,
          message: "User tersebut tidak ada",
        });
      }
      dataUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        res.status(404).json({
          status: 404,
          message: "Password Anda salah",
        });
      }

      const token = jwt.sign(
        {
          email: email,
          userId: dataUser._id.toString(),
        },
        "nectar23@application.com"
      );

      res.status(200).json({
        status: 200,
        token: token,
        userId: dataUser["_id"],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.profile = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const id = req.params.id;

  Auth.findOne({ _id: id })
    .then((result) => {
      if (!result) {
        res.status(404).json({
          status: 404,
          message: "User tersebut tidak ada",
        });
      }

      res.status(200).json({
        status: 200,
        message: "Berhasil mendapatkan data user",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAllUser = (req, res, next) => {
  let totalItems;

  Auth.find()
    .countDocuments()
    .then((numOfUser) => {
      totalItems = numOfUser;

      return Auth.find();
    })
    .then((result) => {
      if (totalItems < 1) {
        res.status(404).json({
          status: 404,
          message: "Data User belum ada",
          totalData: totalItems,
        });
      } else {
        res.status(200).json({
          status: 200,
          message: "Berhasil mendapatkan data seluruh user",
          totalData: totalItems,
          data: result,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
