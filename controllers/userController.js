const { User } = require("../models/User");
const { ErrorHandler } = require("../utils/errorHandler");

const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require("./factory");

/**
 * @description Get all users
 * @method GET
 * @route /user
 * @access Private
 */
exports.getAllUsers = getAll(User);

/**
 * @description Get a single user by ID
 * @method GET
 * @route /user/:id
 * @access Private (only admin & user himself)
 */
exports.getSingleUser = getOne(User);

/**
 * @description Update user
 * @method PUT
 * @route /user/:id
 * @access Private
 */
exports.updateUser = updateOne(User);

/**
 * @description Delete user
 * @method DELETE
 * @route /user/:id
 * @access Private (only admin & user himself)
 */
exports.deleteUser = deleteOne(User);

/**
 * @description Delete user
 * @method DELETE
 * @route /user/:id
 * @access Private (only admin & user himself)
 */
exports.createUser = createOne(User);

exports.isExist = async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(
      new ErrorHandler(
        "Email is already in use. Please try with a different email address.",
        400
      )
    );
  }
  req.body.user = req.user._id.toString();
  next();
};
