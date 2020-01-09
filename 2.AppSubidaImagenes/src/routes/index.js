const { Router } = require("express");
const router = Router();
const Image = require("../models/image");
const path = require("path");
const { unlink } = require("fs-extra");

router.get("/", async (req, res) => {
  const images = await Image.find();
  res.render("index", { images });
  //TODO: Cuadros pintados tipo pinterest...
});

router.get("/upload", (req, res) => {
  res.render("upload");
});

router.post("/upload", async function(req, res) {
  const image = new Image();
  image.title = req.body.title;
  image.description = req.body.description;
  image.filename = req.file.filename;
  image.path = "/img/uploads/" + req.file.filename;
  image.originalname = req.file.originalname;
  image.mimetype = req.file.mimetype;
  image.size = req.file.size;
  await image.save();
  // TODO: Se podria pasar un mensaje como parametro, y formar una alerta de exito.
  res.redirect("/");
});

router.get("/image/:id", async (req, res) => {
  const { id } = req.params; //const id = req.params.id
  const image = await Image.findById(id);
  res.render("profile", { image });
});

router.get("/image/:id/delete", async (req, res) => {
  const { id } = req.params;
  const image = await Image.findByIdAndDelete(id);
  await unlink(path.resolve("./src/public" + image.path));
  res.redirect("/");
});

module.exports = router;
