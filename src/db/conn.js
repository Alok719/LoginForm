const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/Form-Data";
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log(`connected to mongoDB Succesfully`);
  })
  .catch((err) => {
    console.log(err);
  });
