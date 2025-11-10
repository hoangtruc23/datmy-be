const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderMaintainVSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    machineTypeId: {
        type: Types.ObjectId,
        ref: 'products',
    },
    props: [propSchema],
    maintainOperations: [
        {
            operationName: {
                type: String,
                required: true,
            },
            hasValue: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
    ],
    technicalFeedback: [String],
    customerFeedback: [String],
})

const WorkOrderMaintainVModel = model(
    'workOderMaintainV',
    workOrderMaintainVSchema,
)
module.exports = WorkOrderMaintainVModel
