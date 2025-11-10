const { model, Types, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderMaintainASchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    maintainContractDate: {
        type: Date,
    },
    maintainDate: {
        type: Date,
    },
    arrivalTime: {
        type: String,
    },
    departureTime: {
        type: String,
    },
    machineTypeId: {
        type: String,
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
    replacement: {
        type: Types.ObjectId,
        ref: 'products',
    },
    technicalFeedback: [String],
    customerFeedback: [String],
})

const WorkOrderMaintainAModel = model(
    'workOrderMaintainA',
    workOrderMaintainASchema,
)
module.exports = WorkOrderMaintainAModel
