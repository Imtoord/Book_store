const mongoose = require('mongoose');
const Joi = require('joi');
const { ByteString } = require('webidl-conversions');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const UserScema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

UserScema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEY) 
}
const User = mongoose.model("User", UserScema)
function validate(user) {
    const schema = Joi.object({
        name: Joi.string().trim().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).trim().required(),
        username: Joi.string().min(3).max(20).trim().required(),
        isAdmin: Joi.boolean()
    })
    return schema.validate(user);
}

function validateUpdate(user) {
    const schema = Joi.object({
        name: Joi.string().trim(),
        email: Joi.string().email(),
        password: Joi.string().min(8).trim(),
        username: Joi.string().min(3).max(20).trim(),
        isAdmin: Joi.boolean()
    })
    return schema.validate(user);
}

function validatelogin(user) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(20).trim().required()
    })
    return schema.validate(user);
}

module.exports = {
    User,
    validate,
    validateUpdate,
    validatelogin
}