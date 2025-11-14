const { model, Types, Schema } = require('mongoose')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const printHeadSchema = new Schema(
    {
        serialNumber: {
            type: String,
        },
        leftImage: {
            type: String,
        },
        rightImage: {
            type: String,
        },
    },
    { _id: false },
)

const workOrderTestGSchema = new Schema(
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
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null
        },
        props: [propSchema],
        printHeads: [printHeadSchema],
    },
    { timestamps: true },
)

const WorkOrderTestGModel = model('workOrderTestG', workOrderTestGSchema)
module.exports = WorkOrderTestGModel
