const mongoose = require("mongoose");
const { Book } = require("./Book");

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    title: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Populate user field with username before executing any find query
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  });
  next();
});

// Static method to calculate average rating and update book document
// reviewSchema.statics.updateBookStats = async function (bookId) {
//   const res = await this.aggregate([
//     {
//       $match: {
//         book: bookId
//       },
//     },
//     {
//       $group: {
//         _id: "book",
//         averageRating: { $avg: "$rating" },
//         count: { $sum: 1 },
//       },
//     },
//   ]);

//   console.log(res)
//   if (res.length > 0) {
//     await Book.findByIdAndUpdate(bookId, {
//       averageRating: res[0].averageRating,
//       reviewCount: res[0].count,
//     });
//   } else {
//     await Book.findByIdAndUpdate(bookId, {
//       averageRating: 0,
//       reviewCount: 0,
//     });
//   }
// };

// Post-save hook to update book stats after saving a review
reviewSchema.post("save", async function () {
  await this.constructor.updateBookStats(this.book);
});

// Post-remove hook to update book stats after removing a review
reviewSchema.post("remove", async function () {
  await this.constructor.updateBookStats(this.book);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = { Review };
