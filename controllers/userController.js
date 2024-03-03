const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const { User, validateUpdate } = require('../models/User');

const mongoose = require('mongoose')

/**
 * @description all users
 * @method get
 * @route /user
 * @access private
 */
const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password')
    res.status(200).json({ message: users })
})

/**
 * @description single users
 * @method get
 * @route /user/:id
 * @access private (only admin & user himself)
 */
const getSingleUser = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid user ID format' });
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json({ message: user })


})

/**
 * @description update user
 * @method PUT
 * @route /user/id
 * @access private
 */
const updateUser = asyncHandler(async (req, res) => {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).json({ message: error.message })
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10)
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            username: req.body.username
        }
    },
        { new: true }).select('-password')

    await updateUser.save()

    res.status(200).json({ message: 'User updated successfully', updateUser: updateUser })
})

/**
 * @description delete user
 * @method delete
 * @route /user/:id
 * @access private (only admin & user himself)
 */
const deleteUser = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid user ID format' });
    const user = await User.findById(req.params.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'user deleted' })
})
module.exports = { getAllUser, getSingleUser, updateUser, deleteUser }