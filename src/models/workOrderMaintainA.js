const { model, Types, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderMaintainASchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        maintainContractDate: {
            type: Date,
            default: null,
        },
        maintainDate: {
            type: Date,
            default: null,
        },
        arrivalTime: {
            type: String,
            default: null,
        },
        departureTime: {
            type: String,
            default: null,
        },
        machineTypeId: {
            type: String,
            ref: 'products',
            default: null,
        },
        machineInfo: [propSchema],
        machineSpecs: [propSchema],
        maintainOperations: [
            {
                _id: false,
                operationName: {
                    type: String,
                    required: true,
                },
                valueName: {
                    type: String,
                },
                value: {
                    type: Number,
                },
            },
        ],
        replacement: [
            {
                type: Types.ObjectId,
                ref: 'products',
            },
        ],
        technicalFeedback: [String],
        customerFeedback: [String],
    },
    { timestamps: true },
)

const WorkOrderMaintainAModel = model(
    'workOrderMaintainA',
    workOrderMaintainASchema,
)
module.exports = WorkOrderMaintainAModel
