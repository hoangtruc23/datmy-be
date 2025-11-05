const { Schema } = require('mongoose')
const constant = require('../utils/constant/constant')

const contactInfo = new Schema(
    
)

const workOrderAMachineSchema = new Schema(
    {
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
        openTime: {
            type: Number,
        },
        printTime: {
            type: Number,
        },
    },
    { _id: false },
)

const workOrderASpecsSchema = new Schema(
    {
        printHead: {
            type: Number,
        },
        pumpSpeed: {
            type: Number,
        },
        standardPressure: {
            type: Number,
        },
        currentPressure: {
            type: Number,
        },
        recoveryPumpSpeed: {
            // nếu có lưu tốc độ, nếu không có lưu -1
            type: Number,
        },
        vacuumPressure: {
            // nếu có lưu tốc độ, nếu không có lưu -1
            type: Number,
        },
        standardConcentration: {
            type: Number,
        },
        currentConcentration: {
            type: Number,
        },
        inkDropLevel: {
            levelType: {
                type: String,
                enum: Object.values(constant.INK_DROP_LEVEL_TYPE),
            },
            value: {
                type: Number,
            },
        },
        bupTime: {
            type: Number,
        },
        inkTemperature: {
            type: Number,
        },
        chargeLevel: {
            type: String,
        },
        ITM: {
            // không có thì lưu null
            type: String,
        },
        softwareVersion: {
            type: String,
        },
    },
    { _id: false },
)

module.exports = { workOrderAMachineSchema, workOrderASpecsSchema }
