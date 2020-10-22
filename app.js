const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(authRoutes);
app.use("/category", categoryRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    status: status,
    message: message,
    data: data,
  });
});

mongoose
  .connect(
    "mongodb+srv://hramadhaan:Hanief579@cluster0.ki9pf.mongodb.net/nectar_application?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    console.log("Connected");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
