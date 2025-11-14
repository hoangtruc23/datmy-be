const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderMaintainVSchema = new Schema(
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
    },
    { timestamps: true },
)

const WorkOrderMaintainVModel = model(
    'workOrderMaintainV',
    workOrderMaintainVSchema,
)
module.exports = WorkOrderMaintainVModel
