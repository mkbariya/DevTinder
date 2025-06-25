const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://mayankbariya000:mayank000@cluster0.ui3dex4.mongodb.net/devTinder"
  );
};


  module.exports = connectDB;