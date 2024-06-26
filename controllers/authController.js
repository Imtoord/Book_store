const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const { ErrorHandler } = require("../utils/errorHandler");
const { User } = require("../models/User");

const {
  uploadSingleImage,
  resizeImage,
} = require("../middlewares/uploadImageMiddleware");

// Image upload
exports.upload = uploadSingleImage("image");

const arr = ["users", "user", "jpeg", 226, 226, 95];
exports.resizeImage = resizeImage(arr);

/**
 * @description signup
 * @route POST /api/auth/signup
 * @access public
 */
exports.signup = asyncHandler(async (req, res, next) => {
  // Validate request body
  const { username, email, password, image, phone } = req.body;
  if (!username || !email || !password) {
    return next(
      new ErrorHandler("Username, email, and password are required", 400)
    );
  }

  // Check if email already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  // Hash password asynchronously
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create new user
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    image,
    phone,
  });

  // Generate JWT token
  const token = await newUser.generateAuthToken();
  newUser.tokens.push({ token: token });
  await newUser.save();
  const { password: pass, tokens, ...userData } = newUser._doc;

  // Response
  res.status(201).json({
    success: true,
    data: {
      user: userData,
      token,
    },
  });
});

/**
 * @description login
 * @route POST /api/auth/signup
 * @access public
 */
exports.login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Email and password are required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler("Invalid password", 401));
    }

    const userJwt = await user.generateAuthToken();
    user.tokens.push({ token: userJwt });
    await user.save();

    const { password: pass, tokens, ...userData } = user._doc;

    return res.status(200).json({
      success: true,
      data: {
        user: userData,
        token: userJwt,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @description logout
 * @route POST /api/auth/logout
 * @access public
 */
exports.logout = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req;
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];

    // Filter out the token from the tokens array
    user.tokens = user.tokens.filter((t) => t.token !== token);

    // Save the user document after removing the token
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        message: "Logout successfully",
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @description update User password
 * @param {id} req
 * @method put
 * @route /users/changePassword
 * @access private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user._id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(200).json({
      message: `current password is incorrect`,
    });
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler(`password not match`, 400));
  }
  const docs = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(newPassword, 10),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!docs) {
    return next(new ErrorHandler(`user not found`, 404));
  }

  await docs.save();
  const { password: pass, tokens, ...userData } = user._doc;

  return res.status(200).json({
    success: true,
    data: {
      user: userData,
    },
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  req.params.id = req.user._id.toString();
  next();
});

exports.ifEmailExist = asyncHandler(async (req, res, next) => {
  if (req.body.email) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return next(new ErrorHandler("Email already exists", 400));
    }
  }
  next();
});
