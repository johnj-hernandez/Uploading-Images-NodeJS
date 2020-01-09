const express = require("express");
const multer = require("multer");
const path = require("path"); //trabajar con rutas de archivos y directorios
const ejs = require("ejs");

// Set storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

// init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("myImage");

function checkFileType(file, cb) {
  // allowed extensions
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb("Error:  Images Only!");
  }
}

// init app
const app = express();

// EJS
app.set("view engine", "ejs");

//public folder
app.use(express.static("./public"));

// routes
app.get("/", (req, res) => res.render("index"));

app.post("/upload", function(req, res) {
  upload(req, res, error => {
    if (error) {
      // res.send("error");
      res.render("index", { msg: error });
    } else {
      if (req.file == undefined) {
        res.render("index", { msg: "Error, no file selected" });
      } else {
        res.render("index", {
          msg: "File Uploaded",
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
