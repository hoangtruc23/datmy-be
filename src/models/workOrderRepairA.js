const { model, Types, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')
const constant = require('../utils/constant/constant')

const workOrderRepairASchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        maintainContract: {
            type: Boolean,
            default: null,
        },
        repairDate: {
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
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        machineInfo: [propSchema],
        machineSpecs: [propSchema],
        repairAFault: {
            printHeaderFault: [String],
            inkSystemFault: [String],
            electricalSystemFault: [String],
            resolution: [
                {
                    _id: false,
                    name: {
                        type: String,
                        required: true,
                    },
                    state: {
                        type: String,
                        enum: Object.values(
                            constant.REPAIR_A_RESOLUTION_STATE,
                        ).map((i) => i.value),
                        required: true,
                    },
                },
            ],
        },
        technicalFeedback: [String],
        customerFeedback: [String],
    },
    { timestamps: true },
)

const WorkOrderRepairAModel = model('workOrderRepairA', workOrderRepairASchema)
module.exports = WorkOrderRepairAModel
