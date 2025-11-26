const { model, Schema } = require('mongoose')

const workOrderBusinessSchema = new Schema({
    repairFault: [
        {
            _id: false,
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
    repairAFault: {
        printHeaderFault: [String],
        inkSystemFault: [String],
        electricalSystemFault: [String],
        resolution: [String],
    },
    maintainOperations: [
        {
            _id: false,
            operationName: {
                type: String,
                required: true,
            },
            valueName: {
                type: String,
            },
        },
    ],
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
    includedAccessories: [String],
})

const WorkOrderBusinessModel = model(
    'workOrderBusiness',
    workOrderBusinessSchema,
)
module.exports = WorkOrderBusinessModel
