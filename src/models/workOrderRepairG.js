const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')
const constant = require('../utils/constant/constant')

const groupSchema = new Schema(
    {
        printHeadSerialNumber: {
            type: String,
        },
        setting: {
            flipVertical: {
                type: Boolean,
            },
            flipHorizontal: {
                type: Boolean,
            },
            delay: {
                type: String,
            },
        },
        sync: {
            syncSignal: {
                type: String,
                enum: Object.values(constant.SYNC_SIGNAL),
            },
            syncRange: {
                type: String,
            },
            syncMode: {
                type: String,
                enum: Object.values(constant.SYNC_MODE),
            },
        },
        repairGFault: [
            {
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
    { _id: false },
)

const workOrderRepairGSchema = new Schema({
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
    groups: [groupSchema],
})

const WorkOrderRepairGModel = model('workOderRepairG', workOrderRepairGSchema)
module.exports = WorkOrderRepairGModel
