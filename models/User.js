const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
  isAdmin: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  tokens: [{ token: { type: String, required: true } }], // [t1]
  passwordChangedAt: { type: Date },
});

// user.generateAuthToken()
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY);
};

// not show password and tokens
UserSchema.pre(/^find/, function (next) {
  if (!this._conditions._id) {
    // Check if _id is not specified (to exclude findOne)
    this.select("-password -tokens");
  }
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
};
