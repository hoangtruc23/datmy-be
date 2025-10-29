// src/models/order.js
const { Schema, model, Types } = require('mongoose')
const orderSchema = new Schema({
    customerId: {
        type: Types.ObjectId,
        ref: 'customers',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    note: {
        type: String,
    },
})

const OrderModel = model('orders', orderSchema)
module.exports = OrderModel
