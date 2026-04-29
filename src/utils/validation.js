const validator = require("validator");

const validateSignUpData = (req) => {
  //these are the things i wil extract from my object body.
  const { firstName, lastName, emailId, password } = req.body;

  //now we will validation one by one.first check
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || firstName.length > 50)
    throw new Error("Name is not valid");
  //check email id validation usng validatorr library.if my validator is not valid.if itisnot valid id meeans not true
  else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error("please enter a strong password");
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  ); //“Only allow request if every field is inside allowedEditFields it returns boolean suppose user is trying to pass password then it will not allow”

  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateProfileEditData,
};
