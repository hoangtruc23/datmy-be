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
    },
    { timestamps: true },
)

const WorkOrderTestMModel = model('workOrderTestM', workOrderTestMSchema)
module.exports = WorkOrderTestMModel
