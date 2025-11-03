// src/models/customer.js

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
            trim: true,
        },
        ward: {
            type: String,
            trim: true,
        },
        district: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
    },
    { _id: false },
)

const contactPersonSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
    },
    { _id: false },
)

const customerSchema = new Schema(
    {
        // type: {
        //     type: String,
        //     required: true,
        //     enum: ['customer', 'supplier'],
        // },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            trim: true,
        },
        officialName: {
            type: String,
            required: true,
            trim: true,
        },
        taxCode: {
            type: String,
            trim: true,
            // unique: true,
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
        groupCustomers: {
            type: String,
            trim: true,
        },
        CMND: {
            type: String,
            trim: true,
        },
        dateOfIssue: {
            type: Date,
        },
        placeOfIssue: {
            type: String,
        },
        billingAddress: {
            type: String,
            trim: true,
        },
        garageAddress: { type: String, trim: true },
        deliveryAddresses: [deliveryAddressSchema],
        representative: representativeSchema,
        contactPersons: {
            warehouseAccountant: [contactPersonSchema],
            sale: [contactPersonSchema],
            debt: [contactPersonSchema],
            accountant: [contactPersonSchema],
            tech: [contactPersonSchema],
            billAccountant: [contactPersonSchema],
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
        productsInUse: [{ type: Schema.Types.ObjectId, ref: 'products' }],
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

const CustomerModel = model('customers', customerSchema)

module.exports = CustomerModel
// tên, tên chính thức, code, địa chỉ bill, địa chỉ giao hàng (1-5)
