const { Schema, model, Types } = require('mongoose')

const storagesSchema = new Schema({
    trackingCode: String,
    quantity: { type: Number, min: 1 },
    productId: {
        type: Types.ObjectId,
        ref: 'products',
        required: true,
    },
})

const productTransferHistoryDetailSchema = new Schema({
    transferId: {
        type: Types.ObjectId,
        ref: 'ProductTransferHistory',
        required: true,
    },
    oldStorages: [storagesSchema],
    newStorages: [storagesSchema],
})

const productTransferHistoryDetailModel = model(
    'ProductTransferHistoryDetail',
    productTransferHistoryDetailSchema,
)
module.exports = productTransferHistoryDetailModel
