const { Types, model, Schema } = require('mongoose')
const { propSchema, groupSchema } = require('./workOrderDetailHelp')

const workOrderRepairGSchema = new Schema(
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
        repairFault: [
            {
                _id: false,
                fault: {
                    type: String,
                    required: true,
                },
                resolution: {
                    type: String,
                    required: true,
                },
            },
        ],
        technicalFeedback: [String],
        customerFeedback: [String],
    },
    { timestamps: true },
)

const WorkOrderRepairGModel = model('workOrderRepairG', workOrderRepairGSchema)
module.exports = WorkOrderRepairGModel
