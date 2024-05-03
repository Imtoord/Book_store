const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
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
      type: String, // img
      required: true,
    },
    pdf: {
      type: String, 
      // required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// popplute auther 
BookSchema.pre(["save", "find", "findOne", "findOneAndUpdate"], function (next) {
  this.populate("author");
  next();
});

const Book = mongoose.model("Book", BookSchema);

module.exports = {
  Book
};
