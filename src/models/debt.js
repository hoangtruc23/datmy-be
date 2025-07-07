const { Schema, model, Types } = require('mongoose');

const debtSchema = new Schema(
  {
    customer: {
      type: Types.ObjectId,
      ref: 'customers',
      required: true,
    },
    customerName: { type: String, required: true, trim: true },
    totalDebt: { type: Number, required: true },
    isOverdue: { type: Boolean, default: false },
    attemptCount: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

const DebtTaskModel = model('debt', debtSchema);
module.exports = DebtTaskModel;
