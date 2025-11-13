const { Types, model, Schema } = require('mongoose')
const { propSchema, groupSchema } = require('./workOrderDetailHelp')

const workOrderMaintainGSchema = new Schema(
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
        groups: [groupSchema],
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
    },
    { timestamps: true },
)

const WorkOrderMaintainGModel = model(
    'workOrderMaintainG',
    workOrderMaintainGSchema,
)
module.exports = WorkOrderMaintainGModel
