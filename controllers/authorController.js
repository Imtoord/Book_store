const {
  Author,
  validateCreateAuthor,
  validateUpdate,
  verifyLogin,
} = require("../models/Author");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
}).single("image");

/**
 * @description login author
 * @method post
 * @access public
 * @route /author
 */
const authorLogin = asyncHandler(async (req, res) => {
  const { error } = verifyLogin(req.body);
  if (error) return res.status(400).json(error.message);

  const author = await Author.findOne({ email: req.body.email });
  if (!author) return res.status(404).json("author not found");

  const isMatch = await bcrypt.compare(req.body.password, author.password);
  if (!isMatch) return res.status(400).json("invalid password");

  const token = author.generateAuthToken();
  res.status(200).json({ data: author, access_token: token });
});

/**
 * @description add author
 * @method post
 * @access public
 * @route /author
 */
const authorRegester = asyncHandler(async (req, res) => {
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
    const { error } = validateCreateAuthor(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const oldAuthor = await Author.findOne({ email: req.body.email });
    if (oldAuthor) return res.status(400).json("author already exists");

    const author = new Author(req.body);
    await author.save();
    const { password, ...other } = author._doc;
    res.status(200).json({ data: other});
  });
});

/**
 * @description all author
 * @method get
 * @access public
 * @route  author
 */
const allAuthor = asyncHandler(async (req, res) => {
  const authors = await Author.find().select("");
  res.status(200).json({ data: authors });
});

/**
 * @description single author
 * @method get
 * @access public
 * @@route author
 */

const singleAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) return res.status(404).json("author not found");
  res.json({ data: author });
});

/**
 * @description update author
 * @method PUT
 * @access public
 * @route author
 */

const updateAuthor = asyncHandler(async (req, res) => {
  const { error } = validateUpdate(req.body);
  const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!author) return res.status(404).json("author not found");
  if (error) return res.status(400).json(error.message);
  res.json({ data: author });
});

/**
 * @description delete author
 * @method delete
 * @access public
 * @route author
 */
const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (!author) return res.status(404).json("author not found");
  res.json({ message: "author deleted" });
});

module.exports = {
  authorLogin,
  authorRegester,
  allAuthor,
  singleAuthor,
  deleteAuthor,
  updateAuthor,
};
