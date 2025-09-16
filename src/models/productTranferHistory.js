const { Schema, model, Types } = require('mongoose')

const productTransferHistorySchema = new Schema({
    fromWarehouseId: {
        type: Types.ObjectId,
        ref: 'warehouses',
        required: true,
    },
    toWarehouseId: {
        type: Types.ObjectId,
        ref: 'warehouses',
        required: true,
    },
    note: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
})

const productTransferHistoryModel = model('ProductTransferHistory', productTransferHistorySchema)
module.exports = productTransferHistoryModel
