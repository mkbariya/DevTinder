const validator = require("validator");

const validationSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password");
  }
};

const validateEditProfileData = (req) => {
  const { photoUrl, skills } = req.body;

  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Photo URL is invalid");
  }

  if (skills && skills.length > 10) {
    throw new Error("You can specify a maximum of 10 skills");
  }

  const allowedEditFields = ["photoUrl", "gender", "skills", "about", "age","firstName","lastName"];
  const isAllowed = Object.keys(req.body).every((k) =>
    allowedEditFields.includes(k)
  );
  return isAllowed;
};

module.exports = {
  validationSignUpData,
  validateEditProfileData,
};
