const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { ErrorHandler } = require("../utils/errorHandler");
const { User, validate, validatelogin } = require("../models/User"); // Import User model here

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1].toLowerCase();
    if (ext !== "png" && ext !== "jpg" && ext !== "jpeg")
      cb(new Error("not supported"), null);
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

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

    const { error } = validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    let imageUrl = req.image;
    if (!imageUrl) {
      imageUrl = `${req.protocol}://${req.get("host")}/images/av.png`;
    }

    const oldUser = await User.findOne({ email: req.body.email });
    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, image: imageUrl });
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
