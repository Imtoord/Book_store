const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
      max: 1000,
    },
    cover: {
      type: String,
      required: true,
      enum: ["hard", "soft"],
      default: "hard",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

function validateInsertBook(obj) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).trim().required(),
    description: Joi.string().min(3).trim().required(),
    author: Joi.string().hex().length(24).required(),
    rating: Joi.number().min(0).max(5),
    cover: Joi.string().valid("hard", "soft").required(),
    price: Joi.number().min(1).max(1000).required(),
  });
  return schema.validate(obj);
}

function validateUpdate(object) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(50).trim(),
    description: Joi.string().min(3).trim(),
    author: Joi.string().objectId().required(),
    rating: Joi.number().min(0).max(5),
    cover: Joi.string().valid("hard", "soft"),
    price: Joi.number().min(1).max(1000),
  });

  return schema.validate(object);
}

const Book = mongoose.model("Book", BookSchema);

module.exports = {
  Book,
  validateUpdate,
  validateInsertBook,
};
