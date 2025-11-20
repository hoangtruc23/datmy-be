const { model, Schema, Types } = require('mongoose')

const contactPersonSchema = new Schema({
    _id: false,
    contactName: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },
})

const contactPersonCustomerSchema = new Schema({
    customerId: {
        type: Types.ObjectId,
        required: true,
        ref: 'customers',
    },
    contactPerson: [contactPersonSchema],
    address: [String],
})

const ContactPersonCustomerModel = model(
    'contactPersonCustomers',
    contactPersonCustomerSchema,
)
module.exports = ContactPersonCustomerModel
