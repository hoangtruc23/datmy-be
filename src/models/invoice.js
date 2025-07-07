const { Schema, model, Types } = require('mongoose');
const constant = require('../utils/constant/constant')

const contactPersonSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false },
)
const invoiceSchema = new Schema({

    customer: {
      type: Types.ObjectId,
      ref: 'customers',
      required: true,
    },

    customerName: 
    { 
        type: String,
        required: true, 
        trim: true

     },
    invoiceCode: {
      type: String,
      required: true,
      unique: true,
    },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    exportDate: { type: Date, required: true },
    //số ngày được nợ 15,20,30
    debtDays: { type: Number, required: true },
    isFullyPaid: { type: Boolean, default: false },
    orderBy: contactPersonSchema,
    accountant: contactPersonSchema, 
    status: {
        type: String,
        enum: Object.values(constant.INVOICE_STATUS),
        default: constant.INVOICE_STATUS.NULL,
        required: true,
    },

    reminderContact: contactPersonSchema,

    notes: { type: String },
  },
  { timestamps: true }
);

const InvoiceModel = model('invoices', invoiceSchema);
module.exports = InvoiceModel;
