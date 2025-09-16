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
    productId: {
        type: Types.ObjectId,
        ref: 'products',
        required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    oldStorages: [storagesSchema],
    newStorages: [storagesSchema],
})

const productTransferHistoryDetailModel = model(
    'ProductTransferHistoryDetail',
    productTransferHistoryDetailSchema,
)
module.exports = productTransferHistoryDetailModel
