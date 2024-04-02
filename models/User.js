const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  access_token: { type: String },
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY);
};

function validate(user) {
  const schema = Joi.object({
    username: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).trim().required(),
    firstName: Joi.string().min(3).max(20).trim().required(),
    lastName: Joi.string().min(3).max(20).trim().required(),
    isAdmin: Joi.boolean(),
    password: Joi.string().min(3).max(30).required(),
  });
  return schema.validate(user);
}

function validateUpdate(user) {
  const schema = Joi.object({
    name: Joi.string().trim(),
    email: Joi.string().email(),
    password: Joi.string().min(8).trim(),
    username: Joi.string().min(3).max(20).trim(),
    isAdmin: Joi.boolean(),
    password: Joi.string().min(3).max(30),
  });
  return schema.validate(user);
}

function validatelogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).trim().required(),
  });
  return schema.validate(user);
}

UserSchema.pre("save", function (next) {
  if (this.isNeww) {
    this.access_token = jwt.sign(
      { email: this.email },
      process.env.JWT_SECRET_KEY
    );
  }
  next();
});


const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  validate,
  validateUpdate,
  validatelogin,
};
