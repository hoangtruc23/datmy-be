const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderRepairVSchema = new Schema(
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

const WorkOrderRepairVModel = model('workOrderRepairV', workOrderRepairVSchema)
module.exports = WorkOrderRepairVModel
