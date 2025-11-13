const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderDemoSchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        props: [propSchema],
        technicalFeedback: [String],
        customerFeedback: [String],
    },
    { timestamps: true },
)

const WorkOrderDemoModel = model('workOrderDemo', workOrderDemoSchema)
module.exports = WorkOrderDemoModel
