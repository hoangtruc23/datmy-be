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
        laserHeadSerialNumber: {
            type: String,
        },
        installDate: {
            type: Date,
        },
        controllerTime: {
            type: Number,
        },
        laserHeadTime: {
            type: Number,
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
        delay: {
            type: String,
        },
        ignoreDistance: {
            type: String,
        },
    },
    { _id: false },
)

const machineSpecsSchema = new Schema(
    {
        scanHeadType: {
            type: String,
        },
        focus: {
            type: Number,
        },
        laserCoolingType: {
            type: String,
        },
        liveMovement: {
            type: Boolean,
        },
        productMovement: {
            type: String,
            enum: Object.values(constant.PRODUCT_MOVEMENT),
        },
        encoder: {
            type: encoderSchema,
        },
        laserParameter: {
            type: String,
        },
        laserPower: {
            type: String,
        },
        codingSpeed: {
            type: Number,
        },
        jumpSpeed: {
            type: Number,
        },
        maxVectorLength: {
            type: Number,
        },
        softwareType: {
            type: String,
            enum: Object.values(constant.REPAIR_D_SOFTWARE_TYPE),
        },
        softwareVersion: {
            type: String,
        },
    },
    { _id: false },
)

const workOrderRepairDSchema = new Schema({
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

const WorkOrderRepairDModel = model('workOderRepairD', workOrderRepairDSchema)
module.exports = WorkOrderRepairDModel
