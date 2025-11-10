const { model, Types, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderRepairASchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    maintainContract: {
        type: Boolean,
    },
    repairDate: {
        type: Date,
    },
    arrivalTime: {
        type: String,
    },
    departureTime: {
        type: String,
    },
    machineTypeId: {
        type: Types.ObjectId,
        ref: 'products',
    },
    props: [propSchema],
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
    technicalFeedback: [String],
    customerFeedback: [String],
})

const WorkOrderRepairAModel = model('workOrderRepairA', workOrderRepairASchema)
module.exports = WorkOrderRepairAModel
