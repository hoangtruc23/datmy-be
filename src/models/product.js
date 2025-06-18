const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const productSchema = new Schema(
    {
        managementType: {
            type: String,
            required: true,
            enum: Object.values(constant.PRODUCT_MANAGEMENT_TYPE),
        },
        categoryId: {
            type: Types.ObjectId,
            ref: 'categories',
            required: true,
        },
        brand: {
            type: Types.ObjectId,
            ref: 'brands',
            required: true,
        },
        name: {
            type: String,
        },
        shortName: {
            type: String,
        },
        code: {
            type: String,
        },
        specification: {
            type: String,
        },
        unit: {
            type: String,
        },
        safetyQuantity: {
            type: Number,
            min: 0,
        },
        description: {
            type: String,
        },
        isWarranty: {
            type: Boolean,
            required: true,
            default: true,
        },
        image: {
            type: String,
        },
        // //isHasProduct dùng để check là đã thêm sản phẩm thì không cho update managementType nữa
        // isHasProduct: {
        //     type: Boolean,
        //     default: false,
        // },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    { timestamps: true },
)

const ProductModel = model('products', productSchema)

module.exports = ProductModel
