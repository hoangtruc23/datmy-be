const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderInstallationSchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        deliveryDate: {
            type: Date,
            default: null,
        },
        installDate: {
            type: Date,
            default: null,
        },
        handOverDate: {
            type: Date,
            default: null,
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        machineInfo: [propSchema],
        machineSpecs: [propSchema],
        includedAccessories: [String],
        guide: {
            powerControl: [String],
            printProgramming: [String],
            printSetting: [String],
            saveProgram: [String],
            viewSpecifications: [String],
            inkReplace: [String],
            errorMessages: [String],
        },
    },
    { timestamps: true },
)

const WorkOrderInstallationModel = model(
    'workOrderInstallation',
    workOrderInstallationSchema,
)
module.exports = WorkOrderInstallationModel
