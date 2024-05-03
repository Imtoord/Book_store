const path = require("path");

const multer = require("multer");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const { ErrorHandler } = require("../utils/errorHandler");

const multerOptions = () => {
  const fileFilter = (req, file, cb) => {
    const arr = ["image/png", "image/jpg", "image/jpeg"];
    if (arr.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ErrorHandler("Only Image is allowed", 401), false);
    }
  };

  const storage = multer.memoryStorage();

  return multer({ storage: storage, fileFilter: fileFilter });
};

exports.uploadSingleImage = (fileName) => multerOptions().single(fileName);

exports.resizeImage = (arr) =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `${arr[1]}-${Date.now()}.jpeg`;
      await sharp(req.file.buffer)
        .toFormat(arr[2])
        .resize(arr[3], arr[4])
        .jpeg({ quality: arr[5] })
        .toFile(`uploads/${arr[0]}/${filename}`);
      if (arr[0] === "users") {
        req.body.image = `${process.env.HOST}/${arr[0]}/${filename}`;
      } else {
        req.body.cover = `${process.env.HOST}/${arr[0]}/${filename}`;
      }
    }
    next();
  });





const storagex = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/books"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    cb(null, uniqueSuffix + path.extname(file.originalname)); // File name will be a unique suffix + original file extension
  },
});

const fileFilterx = function (req, file, cb) {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true); 
  } else {
    cb(new Error("Only images and PDFs are allowed!"), false); 
  }
};

const upload = multer({
  storage: storagex,
  fileFilter: fileFilterx,
}).fields([
  { name: "cover", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]); // Accept both image and PDF files

exports.uploadBook = upload;
