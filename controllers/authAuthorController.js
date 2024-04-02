const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const { ErrorHandler } = require("../utils/errorHandler");
const {
  validateCreateAuthor,
  verifyLogin,
  Author,
} = require("../models/Author"); // Import Author model here
const { User } = require("../models/User");

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
 * @description Register New Author
 * @method POST
 * @route /Author/register
 * @access Public
 */
const register = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(new ErrorHandler(err.message, 400));
    }

    const { error } = validateCreateAuthor(req.body);
    if (error) return res.status(400).json({ message: error.message });

    let imageUrl = req.image;
    if (!imageUrl) {
      imageUrl = `${req.protocol}://${req.get("host")}/images/av.png`;
    }

    const oldAuthor = await Author.findOne({ email: req.body.email });
    if (oldAuthor)
      return res.status(400).json({ message: "Author already exists" });
    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body.image = imageUrl;
    const newAuthor = new Author({ ...req.body });
    const result = await newAuthor.save();
    const { password, ...other } = result._doc;
    res.status(201).json({ author: other });
  });
});

/**
 * @description Login Author
 * @method POST
 * @route /Author/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { error } = verifyLogin(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const author = await Author.findOne({ email: req.body.email });
  if (!author)
    return res.status(400).json({ message: "Invalid Email or Password" });

  const isMatch = await bcrypt.compare(req.body.password, author.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

  res.status(200).json({ author: author }); 
});

module.exports = { register, login };
