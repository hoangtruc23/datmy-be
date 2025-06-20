const { Schema, model, Types } = require('mongoose')

const productStorageSchema = new Schema(
    {
        warehouseId: {
            type: Types.ObjectId,
            ref: 'warehouses',
            required: true,
        },
        productId: {
            type: Types.ObjectId,
            ref: 'products',
            required: true,
        },
        trackingCode: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            min: 0,
        },
    },
    { timestamps: true },
)

const ProductStorageModel = model('productStorages', productStorageSchema)

module.exports = ProductStorageModel
