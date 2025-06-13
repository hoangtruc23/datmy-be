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
        role: {
            type: String,
            required: true,
            enum: ['kho', 'ban_hang', 'ke_toan', 'ky_thuat'],
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
        contactPersons: [contactPersonSchema],
        notes: {
            type: String,
            trim: true,
        },
        purchaseCycleInWeeks: {
            type: Number,
        },
        internalTransport: { type: Boolean, default: false },
        warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
        productsInUse: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        status: {
            type: String,
            enum: ['active', 'inactive', 'pending'],
            default: 'pending',
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
