const { model, Schema, Types } = require('mongoose')

const contactPersonSchema = new Schema({
    _id: false,
    contactName: {
        type: String,
        required: false,
    },
    contactPhone: {
        type: String,
        required: false,
    },
    contactEmail: {
        type: String,
        required: false,
    },
})

const contactPersonCustomerSchema = new Schema({
    customerId: {
        type: Types.ObjectId,
        required: true,
        ref: 'customers',
    },
    contactPerson: [contactPersonSchema],
    address: [
        {
            provinceCity: {
                type: String,
                required: false,
            },
            ward: {
                type: String,
                required: false,
            },
            specificAddress: {
                type: String,
                required: false,
            }
        }
    ],

    devices: [
        {
            productCode: { //Code của tên máy machine -> ví dụ: A100
                type: String,
                required: true,
            },
            serialNumber: {
                type: String,
                required: false,
            }
        }
    ]
})

const ContactPersonCustomerModel = model(
    'contactPersonCustomers',
    contactPersonCustomerSchema,
)
module.exports = ContactPersonCustomerModel
