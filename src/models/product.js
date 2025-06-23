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
            required: true,
            trim: true,
        },
        shortName: {
            type: String,
            required: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },

        unit: {
            type: Types.ObjectId,
            ref: 'units',
            required: true,
            validate: {
                validator: Types.ObjectId.isValid,
                message: 'Invalid unit id',
            },
        },

        safetyQuantity: {
            type: Number,
            required: true,
            min: 0,
        },
        isWarranty: {
            type: Boolean,
            required: true,
            default: true,
        },

        specification: {
            //quy cách
            type: String,
        },
        description: {
            type: String,
        },

        image: {
            type: String,
        },
        // //isHasProduct dùng để check là đã thêm sản phẩm thì không cho update managementType nữa
        // chưa có hàm thay đổi isHasProduct
        isHasProduct: {
            type: Boolean,
            default: false,
        },
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
