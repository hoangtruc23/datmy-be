const { Schema, model } = require('mongoose')

const brandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true },
)

const BrandModel = model('brands', brandSchema)

module.exports = BrandModel
