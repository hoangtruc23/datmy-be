const { Types, model, Schema } = require('mongoose')
const constant = require('../utils/constant/constant')

const machineInfoSchema = new Schema(
    {
        machineType: {
            type: String,
        },
        controllerSerialNumber: {
            type: String,
        },
        inkType: {
            type: String,
        },
        singlePrintHeadQuantity: {
            type: Number,
        },
        coupledPrintHeadQuantity: {
            type: Number,
        },
        inkSupply: {
            type: String,
        },
        printHeadSerialNumber: {
            type: [String],
        },
    },
    { _if: false },
)

const groupSettingSchema = new Schema(
    {
        flipVertical: {
            type: Boolean,
        },
        flipHorizontal: {
            type: Boolean,
        },
        delay: {
            type: Number,
        },
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
    { _id: false },
)

const workOrderRepairGSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    machineInfo: machineInfoSchema,
    machineSpecs: [groupSettingSchema],
    failure: {
        type: [String],
    },
    handle: {
        type: [String],
    },
    technicianOpinions: {
        type: String,
    },
    customerOpinions: {
        type: [String],
    },
})

const WorkOrderRepairGModel = model('workOderRepairG', workOrderRepairGSchema)
module.exports = WorkOrderRepairGModel
