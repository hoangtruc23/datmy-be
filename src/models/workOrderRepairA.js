const { model, Types, Schema } = require('mongoose')
const {
    workOrderAMachineSchema,
    workOrderASpecsSchema,
} = require('./workOrderA')

const repairTimeSchema = new Schema(
    {
        repairDate: {
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
const failureSchema = new Schema(
    {
        printHead: {
            type: [String],
        },
        inkSystem: {
            type: [String],
        },
        electricalSystem: {
            type: [String],
        },
    },
    { _id: false },
)

const workOrderRepairASchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    maintainContract: {
        type: Boolean,
    },
    repairDate: repairTimeSchema,
    machineInfo: workOrderAMachineSchema,
    machineSpecs: workOrderASpecsSchema,
    failure: failureSchema,
    handlingMethod: {
        type: [String],
    },
    technicianOpinion: {
        type: String,
    },
    customerOpinion: {
        type: [String],
    },
    handling: {
        type: String,
    },
})

const WorkOrderRepairAModel = model('workOrderRepairA', workOrderRepairASchema)
module.exports = WorkOrderRepairAModel
