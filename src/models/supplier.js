// src/models/supplier.js

const { Schema, model } = require('mongoose')

const representativeSchema = new Schema(
    {
        name: { type: String, trim: true },
        title: { type: String, trim: true },
        phone: { type: String, trim: true },
    },
    { _id: false },
)

const deliveryAddressSchema = new Schema(
    {
        street: {
            type: String,
            required: true,
            trim: true,
        },
        ward: {
            type: String,
            required: true,
            trim: true,
        },
        district: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false },
)

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

const supplierSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ['customer', 'supplier'],
        },
        MKH: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        officialName: {
            type: String,
            required: true,
            trim: true,
        },
        taxCode: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        fax: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        billingAddress: {
            type: String,
            required: true,
            trim: true,
        },
        garageAddress: { type: String, trim: true },
        deliveryAddresses: [deliveryAddressSchema],
        representative: representativeSchema,
        contactPersons: {
            ke_toan_kho: [contactPersonSchema],
            ban_hang: [contactPersonSchema],
            ke_toan: [contactPersonSchema],
            ky_thuat: [contactPersonSchema],
            ke_toan_cong_no: [contactPersonSchema],
            ke_toan_hoa_don: [contactPersonSchema],
        },
        notes: {
            type: String,
            trim: true,
        },
        purchaseCycleInWeeks: {
            type: Number,
        },
        internalTransport: { type: Boolean, default: false },
        //warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
        productsInUse: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        status: {
            type: String,
            enum: ['none', 'met', 'not_met'],
            default: 'none',
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
)

const SupplierModel = model('suppliers', supplierSchema)

module.exports = SupplierModel
