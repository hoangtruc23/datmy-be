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
        applicatorType: {
            type: String,
        },
        controllerSerialNumber: {
            type: String,
        },
        labelSize: {
            type: String,
        },
        ribbonType: {
            type: String,
        },
        padSize: {
            type: String,
        },
        conveyorSpeed: {
            type: Number,
        },
    },
    { _if: false },
)

const machineSpecsSchema = new Schema(
    {
        applicatorMode: {
            type: String,
            enum: Object.values(constant.APPLICATOR_MODE),
        },
        minLength: {
            type: Number,
        },
        labelPerProduct: {
            type: Number,
        },
        printHeadType: {
            type: String,
        },
        printSpeed: {
            level: {
                type: String,
                enum: Object.values(constant.PRINT_SPEED_LEVEL),
            },
            speed: {
                type: Number,
            },
        },
        printSignal: {
            type: String,
        },
        labelApplySignal: {
            type: String,
        },
        airPressure: {
            type: Number,
        },
        padOffset: {
            type: Number,
        },
        ACCfirwareVersion: {
            type: String,
        },
        ACCBootloaderVersion: {
            type: String,
        },
        installDirection: {
            type: String,
        },
        otherFeatures: {
            type: [String],
        },
    },
    { _id: false },
)

const workOrderRepairMSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    machineInfo: machineInfoSchema,
    machineSpecs: machineSpecsSchema,
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

const WorkOrderRepairMModel = model('workOderRepairM', workOrderRepairMSchema)
module.exports = WorkOrderRepairMModel
