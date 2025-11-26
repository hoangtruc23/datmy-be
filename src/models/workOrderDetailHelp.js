const { model, Types, Schema } = require('mongoose')
const constant = require('../utils/constant/constant')

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
            enum: Object.values(constant.PURPOSE_TEST).map(
                (item) => item.value,
            ),
        },
        receiptDate: {
            type: Date,
        },
    },
    { _id: false },
)

const groupSchema = new Schema(
    {
        printHeadSerialNumber: {
            type: String,
        },
        setting: {
            flipVertical: {
                type: Boolean,
            },
            flipHorizontal: {
                type: Boolean,
            },
            delay: {
                type: String,
            },
        },
        sync: {
            syncSignal: {
                type: String,
                enum: Object.values(constant.SYNC_SIGNAL),
            },
            syncRange: {
                type: String,
            },
            syncMode: {
                type: String,
                enum: Object.values(constant.SYNC_MODE),
            },
        },
    },
    { _id: false },
)

module.exports = { propSchema, testBaseSchema, groupSchema }
