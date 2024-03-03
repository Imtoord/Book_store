const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;
const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 1000,
    },
    cover: {
        type: String,
        required: true,
        enum: ['hard', 'soft', 'cover'],
        default: 'hard',
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    }
}, {
    timestamps: true
})

// BookSchema.statics.findById = async function (id) {
//     return await this.findOne({ _id: id });
// };

function validateinsert(obj) {
    const schame = Joi.object({
        title: Joi.string().min(3).max(30).trim().required(),
        description: Joi.string().min(3).max(30).trim().required(),
        author: Joi.string().required(),
        rating: Joi.number().min(1).max(5),
        cover: Joi.string().valid('hard', 'soft').required(),
        price: Joi.number().min(1).max(1000).required()
    })
    return schame.validate(obj);
}

function validateUpdate(object) {
    const schame = Joi.object({
        title: Joi.string().min(3).max(30).trim(),
        description: Joi.string().min(3).max(30).trim(),
        author: Joi.string().required(),
        rating: Joi.number().min(1).max(5),
        cover: Joi.string().valid('hard', 'soft'),
        price: Joi.number().min(1).max(1000)
    })

    return schame.validate(object)
}

const Book = mongoose.model("Book", BookSchema)
module.exports = {
    Book,
    validateUpdate,
    validateinsert,
};