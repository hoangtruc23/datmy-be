const { Schema, model } = require('mongoose')

const productCategorySchema = new Schema(
    {
        image: {
            type: String,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        productType: {
            type: String, //component or material
            required: false,
            //Nguyên liệu hay là linh kiện
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true },
)

const ProductCategoryModel = model('productCategories', productCategorySchema)

module.exports = ProductCategoryModel
