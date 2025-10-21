const { model, Types, Schema } = require('mongoose')
const {
    workOrderAMachineSchema,
    workOrderASpecsSchema,
} = require('./workOrderA')

const maintainTimeSchema = new Schema(
    {
        maintainDate: {
            type: Date,
        },
        arrivalTime: {
            type: String,
        },
        departureTime: {
            type: String,
        },
    },
    { _id: false },
)
const workOrderMaintainASchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    maintainContractDate: {
        type: String,
    },
    maintainDate: maintainTimeSchema,
    machineInfo: workOrderAMachineSchema,
    machineSpecs: workOrderASpecsSchema,
    maintenanceOperation: {
        type: [String],
    },
    replacementPart: {
        type: [String],
    },
    technicianOpinion: {
        type: String,
    },
    customerOpinion: {
        type: [String],
    },
})

const WorkOrderMaintainAModel = model(
    'workOrderMaintainA',
    workOrderMaintainASchema,
)
module.exports = WorkOrderMaintainAModel
