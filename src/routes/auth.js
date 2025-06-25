const express = require("express");
const authRouter = express.Router();
const { validationSignUpData } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validationSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const userEmail = await User.findOne({ emailId: emailId });
    if (userEmail) {
      throw new Error("Email is already used");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
     const token = await savedUser.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 10 * 3600000),
        httpOnly: true,
      });
    res.json({ message: "User Added Successfully", data: savedUser });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 10 * 3600000),
        httpOnly: true,
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout Successfully");
});

module.exports = authRouter;
