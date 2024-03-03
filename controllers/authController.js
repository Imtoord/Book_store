const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { User, validate, validatelogin } = require("../models/User");

/**
 * @description Register New User
 * @method POST
 * @route /user/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const oldUser = await User.findOne({ email: req.body.email });
  if (oldUser) return res.status(400).json({ message: "User already exists" });

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const user = new User(req.body);
  const result = await user.save();
  const { password, ...other } = result._doc;
  const token = user.generateAuthToken();

  res.status(201).json({ access_token: token, user: other });
});

/**
 * @description Login User
 * @method POST
 * @route /user/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { error } = validatelogin(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ message: "Invalid Email or Password" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

  const token = user.generateAuthToken();
  res.status(200).json({ access_token: token, user: user });
});

module.exports = { register, login };
