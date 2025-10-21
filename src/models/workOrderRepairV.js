const { Types, model, Schema } = require('mongoose')
const constant = require('../utils/constant/constant')

const machineInfoSchema = new Schema(
    {
        machineType: {
            type: String,
        },
        machineSerialNumber: {
            type: String,
        },
        ribbonType: {
            type: String,
        },
        printHeadDirection: {
            type: String,
            enum: Object.values(constant.PRINTHEAD_DIRECTION),
        },
        printHeadMeters: {
            type: String,
        },
    },
    { _if: false },
)

const encoderSchema = new Schema(
    {
        source: {
            type: String,
            enum: Object.values(constant.ENCODER_SOURCE),
        },
        scale: {
            type: String,
        },
    },
    { _id: false },
)

const printHeadSchema = new Schema(
    {
        type: {
            type: String,
        },
        height: {
            type: Number,
        },
        temperature: {
            type: String,
        },
        resistance: {
            type: String,
        },
    },
    { _id: false },
)

const generalSetting = new Schema(
    {
        contrast: {
            type: String,
        },
        printHeadPressure: {
            type: String,
        },
        retractLimit: {
            type: Number,
        },
        printSpeed: {
            type: Number,
        },
        softwareVersion: {
            type: String,
        },
        Preheart: {
            type: String,
        },
    },
    { _id: false },
)

const workOrderRepairVSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    machineInfo: machineInfoSchema,
    machineSpecs: {
        type: {
            type: String,
            enum: Object.values(constant.PRINT_MODE),
        },
        encoder: encoderSchema,
        printHead: printHeadSchema,
        generalSetting: generalSetting,
    },
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

const WorkOrderRepairVModel = model('workOderRepairV', workOrderRepairVSchema)
module.exports = WorkOrderRepairVModel
