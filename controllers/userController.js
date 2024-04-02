const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { User, validateUpdate } = require("../models/User");
const errorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");

/**
 * @description Get all users
 * @method GET
 * @route /user
 * @access Private
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json({ users });
});

/**
 * @description Get a single user by ID
 * @method GET
 * @route /user/:id
 * @access Private (only admin & user himself)
 */
const getSingleUser = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid user ID format" });

  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ user });
});

/**
 * @description Update user
 * @method PUT
 * @route /user/:id
 * @access Private
 */
const updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const { password, ...updateFields } = req.body;
  if (password) updateFields.password = await bcrypt.hash(password, 10);

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updateFields,
    { new: true }
  ).select("-password");
  if (!updatedUser) return res.status(404).json({ message: "User not found" });

  res
    .status(200)
    .json({ message: "User updated successfully", user: updatedUser });
});

/**
 * @description Delete user
 * @method DELETE
 * @route /user/:id
 * @access Private (only admin & user himself)
 */
const deleteUser = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid user ID format" });

  const user = await User.findByIdAndDelete(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ message: "User deleted successfully", user });
});

module.exports = { getAllUsers, getSingleUser, updateUser, deleteUser };
