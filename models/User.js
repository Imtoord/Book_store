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
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 11,
    maxlength: 11,
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
  wishList: [{ type: Schema.Types.ObjectId, ref: "Book" }],
  tokens: [{ token: { type: String, required: true } }],
  passwordChangedAt: { type: Date },
});

// user.generateAuthToken()
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

// not show password and tokens
// UserSchema.pre(/^find/, function (next) {
//   if (!this._conditions._id) {
//     // Check if _id is not specified (to exclude findOne)
//     this.select("-tokens");
//   }
//   next();
// });

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
};
