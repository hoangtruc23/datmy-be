const { model, Schema } = require('mongoose')
const repairFaultSchema = new Schema(
    {
        fault: {
            type: String,
            required: true,
        },
        resolution: {
            type: String,
            required: true,
        },
    },
    { _id: false },
)

const workOrderBusinessSchema = new Schema({
    repairDFault: [repairFaultSchema],
    repairGFault: [repairFaultSchema],
    repairVFault: [repairFaultSchema],
    repairMFault: [repairFaultSchema],
    repairAFault: {
        printHeaderFault: [String],
        inkSystemFault: [String],
        electricalSystemFault: [String],
        resolution: [
            {
                name: {
                    type: String,
                    required: true,
                },
                isReplace: {
                    type: Boolean,
                    required: true,
                },
                isLoan: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
    },
    maintainOperations: [
        {
            operationName: {
                type: String,
                required: true,
            },
            hasValue: {
                type: Boolean,
                required: true,
                default: false,
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
})

const WorkOrderBusinessModel = model(
    'workOrderBusiness',
    workOrderBusinessSchema,
)
module.exports = WorkOrderBusinessModel
