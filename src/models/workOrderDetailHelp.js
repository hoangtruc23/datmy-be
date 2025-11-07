const { model, Types, Schema } = require('mongoose')

const propSchema = new Schema(
    {
        propId: {
            type: Types.ObjectId,
            required: true,
            ref: 'machineProperties',
        },
        value: {
            type: String,
        },
    },
    { _id: false },
)

const testBaseSchema = new Schema(
    {
        testDate: {
            type: Date,
        },
        testerId: {
            type: Types.ObjectId,
            ref: 'technicians',
        },
        purposeTest: {
            type: String,
            enum: Object.values(constant.PURPOSE_TEST),
        },
        receiptDate: {
            type: Date,
        },
    },
    { _id: false },
)

module.exports = { propSchema, testBaseSchema }
