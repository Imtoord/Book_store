const { expression } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema to cart
const cartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  books: [
    {
      book_id: { type: Schema.Types.ObjectId, ref: "Book" },
      price: Number,
    },
  ],
  total_price: { type: Number, default: 0 },
});

cartSchema.pre(/^find/, function (next) {
  this.populate("user_id", "username");
  this.populate("books.book_id");
  next()
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = {
  Cart,
};
