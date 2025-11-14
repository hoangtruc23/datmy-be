const { model, Types, Schema } = require('mongoose')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const workOrderTestDSchema = new Schema(
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

const WorkOrderTestDModel = model('workOrderTestD', workOrderTestDSchema)
module.exports = WorkOrderTestDModel
