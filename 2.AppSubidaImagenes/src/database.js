const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/finterest", { useNewUrlParser: true })
  .then(db => console.log("DB is connected"))
  .catch(err => console.log("err" + err));
