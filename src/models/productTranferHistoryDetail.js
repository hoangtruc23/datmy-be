const { Schema, model, Types } = require('mongoose')

const storagesSchema = new Schema({
    trackingCode: String,
    quantity: { type: Number, min: 1 },
})

const productTransferHistoryDetailSchema = new Schema({
    transferId: {
        type: Types.ObjectId,
        ref: 'ProductTransferHistory',
        required: true,
    },
    oldProductId: {
        type: Types.ObjectId,
        ref: 'products',
        required: true,
    },
    oldStorages: [storagesSchema],
    newProductId: {
        type: Types.ObjectId,
        ref: 'products',
        required: true,
    },
    newStorages: [storagesSchema],
})

const productTransferHistoryDetailModel = model(
    'ProductTransferHistoryDetail',
    productTransferHistoryDetailSchema,
)
module.exports = productTransferHistoryDetailModel
