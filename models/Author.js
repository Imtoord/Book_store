const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const AuthorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    access_token: { type: String },
  },
  {
    timestamps: true,
  }
);

AuthorSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

function validateCreateAuthor(obj) {
  const schame = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    bio: Joi.string().min(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
  });
  return schame.validate(obj);
}

function validateUpdate(object) {
  const schame = Joi.object({
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string().min(3).max(30),
    bio: Joi.string().min(15),
    email: Joi.string().email(),
    password: Joi.string().min(3).max(30),
  });

  return schame.validate(object);
}

const verifyLogin = (obj) => {
  const schame = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
  });
  return schame.validate(obj);
};

AuthorSchema.pre("save", function (next) {
  if (this.isNeww) {
    this.access_token = jwt.sign(
      { email: this.email },
      process.env.JWT_SECRET_KEY
    );
  }
  next();
});
AuthorSchema.pre("findOne", function (next) {
  this.access_token = jwt.sign(
    { email: this.email },
    process.env.JWT_SECRET_KEY
  );

  next();
});

module.exports = {
  Author: mongoose.model("Author", AuthorSchema),
  validateCreateAuthor,
  validateUpdate,
  verifyLogin,
};