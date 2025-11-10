const { Types, model, Schema } = require('mongoose')
const {propSchema} = require('./workOrderDetailHelp')

const workOrderMaintainMSchema = new Schema({
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
    technicalFeedback: [String],
    customerFeedback: [String],
})

const WorkOrderMaintainMModel = model('workOderMaintainM', workOrderMaintainMSchema)
module.exports = WorkOrderMaintainMModel
