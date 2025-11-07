const { model, Types, Schema } = require('mongoose')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const printHeadSchema = new Schema(
    {
        serialNumber: {
            type: String,
        },
        leftImage: {
            type: String,
        },
        rightImage: {
            type: String,
        },
    },
    { _id: false },
)

const workOrderTestGSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    baseInfo: testBaseSchema,
    machineTypeId: {
        type: Types.ObjectId,
        ref: 'products',
    },
    props: [propSchema],
    printHeads: [printHeadSchema],
})

const WorkOrderTestGModel = model('workOrderTestG', workOrderTestGSchema)
module.exports = WorkOrderTestGModel
