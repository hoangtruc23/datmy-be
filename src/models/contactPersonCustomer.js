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
            },
            contractType: { // rent - buy - demo
                type: String,
                required: false,
            },
            isActive: {
                type: Boolean,
                required: true,
                default: true
            },
            installDate: { // Ngày lắp đặt
                type: Date,
                required: false,
            },
            // lastFilterChangeDate: { //Ngày thay đầu lọc gần nhất
            //     type: Date,
            //     required: false,
            // },
            // lastFilterChangeInkjetTime: { //Thời gian in phun gần nhất
            //     type: Number,
            //     required: false,
            //     default: 0,
            // },
            // currentInkjetTime: { // Thời gian in phun hiện tại
            //     type: Number,
            //     required: false,
            //     default: 0,
            // },
            // warningReplaceFilter: {  // Cảnh báo thay đầu lọc
            //     type: Boolean,
            //     required: false,
            //     default: false,
            // }
        }
    ]
})

const ContactPersonCustomerModel = model(
    'contactPersonCustomers',
    contactPersonCustomerSchema,
)
module.exports = ContactPersonCustomerModel
