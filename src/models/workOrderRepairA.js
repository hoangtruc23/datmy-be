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
    machineTypeId: {
        type: String,
        ref: 'products',
    },
})

const WorkOrderRepairAModel = model('workOrderRepairA', workOrderRepairASchema)
module.exports = WorkOrderRepairAModel
