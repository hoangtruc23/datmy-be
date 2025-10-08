const { model, Types, Schema } = require('mongoose')

const workOrderTestASchema = new Schema({
    workOrderId: {
        type: new Types.ObjectId(),
        required: true,
    },
    testDate: {
        type: Date,
    },
    machineType: {
        type: String,
    },
    inkType: {
        type: String,
    },
    Printhead: {
        type: Number,
    },
    injectionPipeLength: {
        type: Number,
    },
    serialNumber: {
        type: String,
    },
    OpenTime: {
        type: Number,
    },
    printTime: {
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

const WorkOrderTestAModel = model('workOrderTestA', workOrderTestASchema)
module.exports = WorkOrderTestAModel
