const { Review } = require("../models/Review");
const { ErrorHandler } = require("../utils/errorHandler");

const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} = require("./factory");

/**
 * @description get all Review
 * @route api/Reviews
 * @method get
 * @access public
 */
exports.getReviews = getAll(Review);

exports.exist = async (req, res, next) => {
  const review = await Review.findOne({
    user: req.user._id.toString(),
    book: req.body.book,
  });
  if (review) {
    return next(new ErrorHandler("You already reviewed this product!!!!", 400));
  }
  req.body.user = req.user._id.toString();
  next();
};

/**
 * @description create new Review
 * @param {title, rating, user, product} req
 * @method post
 * @route api/Reviews
 * @access private/user
 */
exports.createReview = createOne(Review);

/**
 * @description get Review
 * @param {id} req
 * @method get
 * @route api/Reviews/:id
 * @access public
 */
exports.getReview = getOne(Review);

/**
 * @description update Review
 * @param {id} req
 * @method put
 * @route api/Reviews/:id
 * @access private/user
 */
exports.updateReview = updateOne(Review);

/**
 * @description delete Review
 * @param {id} req
 * @method delete
 * @route api/Reviews/:id
 * @access private/user || private/admin
 */
exports.deleteReview = deleteOne(Review);

//  * @description check if user is reviewer
//  * @param {id} req

exports.isReviewer = async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  // console.log(review);
  if(!review){
    return next(new ErrorHandler("Review not found", 404));
  }

  if (review.user._id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to do this action", 401)
    );
  }
  next();
};

exports.filter= (req , res, next)=>{
  if (req.params.bookId) {
    req.filterobj = { book: req.params.bookId };
  }
  next()
}