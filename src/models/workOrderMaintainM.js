const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderMaintainMSchema = new Schema(
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
        technicalFeedback: [String],
        customerFeedback: [String],
        status: {
            type: String,
            enum: ['active', 'cancelled'],
            default: 'active',
        },
    },
    { timestamps: true },
)

const WorkOrderMaintainMModel = model(
    'workOrderMaintainM',
    workOrderMaintainMSchema,
)
module.exports = WorkOrderMaintainMModel
