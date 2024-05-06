const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { ErrorHandler } = require("../utils/errorHandler");
const { User } = require("../models/User");

const ifToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    verifyToken(req, res, next);
  } else {
    next();
  }
});

const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    // 1) check if token exist
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }
    const token = authorization.split(" ")[1];
    // Breare token

    // 2) verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);

    // 3) check if user exists
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    //4) check if user logged out
    const chackToken = user.tokens.find((t) => t.token === token); // tokens =[token]
    // console.log(user);
    // console.log(token);
    // console.log(decoded);
    if (!chackToken) {
      return next(new ErrorHandler("User not found", 404));
    }

    // 5) check if user changed password
    if (user.passwordChangedAt) {
      const pass = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
      if (pass > decoded.iat) {
        // clean tokens
        user.tokens = [];
        await user.save();
        return next(
          new ErrorHandler(
            "User recently changed password. Please login again",
            401
          )
        );
      }
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
});

const verifyTokenAndAdmin = asyncHandler((req, res, next) => {
  // console.log(req.user);
  if (req.user.isAdmin) {
    console.log("..............///");
    next();
  } else {
    return next(
      new ErrorHandler("You are not allwoed to access this route", 403)
    );
  }
});

module.exports = { verifyTokenAndAdmin, verifyToken, ifToken };
