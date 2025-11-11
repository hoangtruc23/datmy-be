const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderInstallationSchema = new Schema({
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
    guide: {
        powerControl: [String],
        printProgramming: [String],
        printSetting: [String],
        saveProgram: [String],
        viewSpecifications: [String],
        inkReplace: [String],
        errorMessages: [String],
    },
    technicalFeedback: [String],
    customerFeedback: [String],
})

const WorkOrderInstallationModel = model(
    'workOrderInstallation',
    workOrderInstallationSchema,
)
module.exports = WorkOrderInstallationModel
