const { Types, Schema } = require('mongoose')

const workOrderASchema = new Schema({
    workOrderId: {
        type: new Types.ObjectId(),
        required: true,
    },
    maintainContract: {
        type: Boolean,
    },
    repairDate: {
        type: repairTimeSchema,
    },
    machineType: {
        type: String,
    },
    serialNumber: {
        type: String,
    },
    inkType: {
        type: String,
    },
    installDate: {
        type: Date,
    },
    OpenTime: {
        type: Number,
    },
    printTime: {
        type: Number,
    },
    Printhead: {
        type: Number,
    },
    injectionPipeLength: {
        type: Number,
    },

    pumpSpeed: {
        type: Number,
    },
    pumpType: {
        type: String,
    },
    standardPressure: {
        type: Number,
    },
    currentPressure: {
        type: Number,
    },
    recoveryPumpSpeed: {
        type: Number,
    },
    vacuumPressure: {
        type: Number,
    },
    standardConcentration: {
        type: Number,
    },
    currentConcentration: {
        type: Number,
    },
    inkDropLevel: {
        type: String,
    },
    bupTime: {
        type: Number,
    },
    chargeLevel: {
        type: String,
    },
    ITM: {
        type: String,
    },
    softwareVersion: {
        type: String,
    },
    language: {
        type: String,
    },
    note: {
        type: String,
    },
})

module.exports = WorkOrderASchema
