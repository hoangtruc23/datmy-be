const { model, Types, Schema } = require('mongoose')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const workOrderTestMSchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        baseInfo: {
            type: testBaseSchema,
            default: null,
        },
        purposeTest: {
            type: String,
            default: null,
        },
        receiptDate: {
            type: Date,
            default: null,
        },
        testDate: {
            type: Date,
            default: null,
        },
        serialControllerNumber: {
            type: String,
            default: null,
        },
        serialNumber: {
            type: String,
            default: null,
        },
        otherFeatures: {
            type: [String],
            default: [],
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        props: [propSchema],

        image: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['active', 'cancelled'],
            default: 'active',
        },
    },
    { timestamps: true },
)

const WorkOrderTestMModel = model('workOrderTestM', workOrderTestMSchema)
module.exports = WorkOrderTestMModel
