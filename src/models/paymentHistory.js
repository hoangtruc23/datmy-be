const { Schema, model, Types } = require('mongoose');
const constant = require('../utils/constant/constant');
const { REDISEARCH_LANGUAGE } = require('redis');

const paymentHistorySchema = new Schema(
  {
    invoice: {
      type: Types.ObjectId,
      ref: 'invoices',
      required: true,
    },
    customerName: 
    { 
        type: String,
        required: true, 
        trim: true

    },
    paymentDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    content: { type: String },
    status: {
        type: String,
        enum: Object.values(constant.PAYMENT_STATUS),
        required: true,
    },
    method: {
        type: String,
        enum: Object.values(constant.PAYMENT_METHOD),
        default: constant.APPROVAL_STATUS.NULL,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const PaymentHistoryModel = model('payment_histories', paymentHistorySchema);
module.exports = PaymentHistoryModel;
