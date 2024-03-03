const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');

/**
 * @method get
 * @route /forgot-password
 */
const forgotPasswordForm = asyncHandler((req, res) => {
    res.render('forgotPasswordForm.ejs')
})

/**
 * @method post
 * @route /forgot-password
 */
/**
 * POST method to handle the forgot password request
 * @route /forgot-password
 */
const forgotPasswordLink = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY + user.password, { expiresIn: '1h' });
    const link = `${process.env.DOMAINNAME}/forgot-password/${user._id}/${token}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: user.email,
        subject: 'Reset Password',
        html: `
            <h1>Click on the link to reset your password</h1>
            <a href="${link}">${link}</a>
        `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        res.status(200).json({ message: "Check your email", email: user.email });
    });
});

/**
 * @method get
 * @route /forgot-password/:id/:token
 */
const resetPasswordView = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'user not found' })
    try {
        jwt.verify(req.params.token, process.env.JWT_SECRET_KEY + user.password)
        res.render('resetPassword.ejs', { email: user.email })
    } catch (err) {
        res.status(404).json({ message: 'invalid token' })
    }
})

/**
 * @method post
 * @route /forgot-password/:id/:token
 */
const resetPassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'user not found' })
    try {
        jwt.verify(req.params.token, process.env.JWT_SECRET_KEY + user.password)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(404).json({ message: 'invalid token' })
    }
})

module.exports = {
    forgotPasswordForm,
    forgotPasswordLink,
    resetPasswordView,
    resetPassword
};