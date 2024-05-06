const asyncHandler = require("express-async-handler");

const { ErrorHandler } = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatuers");

// delete
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const docs = await Model.findByIdAndDelete(req.params.id);

    if (!docs) {
      return next(new ErrorHandler(`${Model.name} not found`, 404));
    }
    // await docs.remove()
    return res.status(203).json({
      message: `${Model.name} deleted successfully`,
    });
  });

// update
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const docs = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!docs) {
      return next(new ErrorHandler(`${Model.name} not found`, 404));
    }
    const { password: pass, tokens, ...userData } = docs._doc;

    await docs.save();
    return res.status(200).json({
      message: `${Model.name}  updated successfully`,
      data: userData,
    });
  });

// get one
exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const docs = await Model.findById(req.params.id);
    if (!docs) {
      return next(new ErrorHandler(`${Model.name} not found ;(`, 404));
    }

    const { password: pass, tokens, ...userData } = docs._doc;

    return res.status(200).json({
      success: true,
      data: {
        user: userData,
      },
    });
  });

// create One
exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const docs = await new Model(req.body);
    await docs.save();
    return res.status(201).json({
      success: true,
      message: `${Model.name} create successfully`,
      data: docs,
    });
  });

// get all
exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filterobjx = {};
    if (req.filterobj) {
      filterobjx = req.filterobj;
    }

    // build query
    const documentCounet = await Model.countDocuments(); // 10
    const docs = new ApiFeatures(Model.find(filterobjx), req.query)
      .sort()
      .Pagination(documentCounet)
      .fields()
      .Filter()
      .search();
    // execute query
    const { mongoQuery, pagination } = docs;
    const results = await mongoQuery;
    return res.status(200).json({
      success: true,
      results: results.length,
      pagination,
      data: results,
    });
  });

  
exports.search = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { keyword } = req.query;
    let docs = [];

    if (keyword) {
      docs = await Model.find({
        $or: [
          { title: { $regex: keyword, $options: "i" } }, // Perform case-insensitive search
          { description: { $regex: keyword, $options: "i" } }, // Perform case-insensitive search
        ],
      });
    }

    return res
      .status(200)
      .json({ success: true, results: docs.length, data: docs });
  });
