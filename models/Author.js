const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

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
      data: Buffer,
      contentType: String,
    },
    access_token: { type: String },
  },
  {
    timestamps: true,
  }
);

AuthorSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY);
};

const Author = mongoose.model("Author", AuthorSchema);
function validateCreateAuthor(obj) {
  const schame = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
  });
  return schame.validate(obj);
}

function validateUpdate(object) {
  const schame = Joi.object({
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string().min(3).max(30),
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
  if (this.isNew) {
    this.access_token = jwt.sign(
      { email: this.email, role: this.role },
      process.env.SECRET_KEY
    );
  }
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

module.exports = {
  Author,
  validateCreateAuthor,
  validateUpdate,
  verifyLogin,
};
