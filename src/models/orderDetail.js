const { Schema, model, Types } = require('mongoose');

const orderDetailSchema = new Schema(
  {
    orderId: {
      type: Types.ObjectId,
      ref: 'orders',
      required: true,
    },
    productId: {
      type: Types.ObjectId,
      ref: 'products',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    quantityExported: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const OrderDetailModel = model('orderDetails', orderDetailSchema);
module.exports = OrderDetailModel;
