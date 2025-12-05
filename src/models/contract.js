const { Schema, model, Types } = require('mongoose')

const ContractSchema = new Schema(
    {
        numberOfContract: {
            type: String,
            required: true,
        },
        customerId: {
            type: Types.ObjectId,
            ref: 'customers',
            required: true,
        },
        machineId: {
            type: Array,
            required: true,
        },
        maintenance: {
            type: Array,
            required: true,
        },
        dateOfSigning: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        workOrderId: {
            type: Types.ObjectId,
            ref: 'customers',
            required: false,
        },
    },
    { timestamps: true },
)

const ContractModel = model('contracts', ContractSchema)

module.exports = ContractModel
