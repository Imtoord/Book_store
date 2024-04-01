const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { User, validate, validatelogin } = require("../models/User");
const multer = require("multer");
const { ErrorHandler } = require("../utils/errorHandler");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
}).single("image");

/**
 * @description Register New User
 * @method POST
 * @route /user/register
 * @access Public
 */
const register = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler(err.message, 400));
    }
    let image;
    if (!req.file) {
      const defaultAvatarPath = "images/av.png";
      image = {
        data: fs.readFileSync(defaultAvatarPath),
        contentType: "image/jpeg",
      };
    } else {
      image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ ...req.body, image: image });
    const result = await user.save();
    const { password, ...other } = result._doc;
    res.status(201).json({ user: other });
  });
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
