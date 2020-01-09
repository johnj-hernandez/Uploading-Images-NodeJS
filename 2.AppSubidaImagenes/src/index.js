const express = require("express");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const uuid = require("uuid/v4");
const { format } = require("timeago.js");
const { unlink } = require("fs-extra");
// Inicializaciones
const app = express();
require("./database");
//Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middleware
app.use(morgan("dev")); //datos peticiones en consola
app.use(express.urlencoded({ extended: false })); //entender datos de formularios
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/img/uploads"),
  filename: (req, file, cb, filename) => {
    cb(null, uuid() + path.extname(file.originalname));
  }
});
app.use(multer({ storage: storage }).single("image"));

//global variables
app.use(function(req, res, next) {
  res.locals.agoFormat = format;
  next();
});
//Routes
app.use(require("./routes/index"));
//Static files
app.use(express.static(path.join(__dirname, "public")));
// Start server
app.listen(app.get("port"), () =>
  console.log(`Server listening on port ${app.get("port")}!`)
);
