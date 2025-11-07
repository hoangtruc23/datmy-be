const { model, Types, Schema } = require('mongoose')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const workOrderTestMSchema = new Schema({
    workOrderId: {
        type: Types.ObjectId,
        required: true,
        ref: 'workOrders',
    },
    baseInfo: testBaseSchema,
    machineTypeId: {
        type: String,
        ref: 'products',
    },
    props: [propSchema],
    image: {
        type: String,
    },
})

const WorkOrderTestMModel = model('workOrderTestM', workOrderTestMSchema)
module.exports = WorkOrderTestMModel
