const express = require("express");
const bcrypt = require('bcrypt')
const validator = require('validator');
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const { validateEditProfileData } = require("../utils/validation.js");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Error Fields");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

profileRouter.post("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const {newPassword} = req.body;

    if(!validator.isStrongPassword(newPassword)){
        throw new Error("Please Enter a Strong Password")
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);

    loggedInuser.password = passwordHash;
    await loggedInuser.save();
    res.send("Password updated Successfully");
  } catch (error) {
    res.status(400).send("ERROR:" + error.message);
  }
});

module.exports = profileRouter;
