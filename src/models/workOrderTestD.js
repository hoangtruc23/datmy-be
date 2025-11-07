const { model, Types, Schema } = require('mongoose')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const workOrderTestDSchema = new Schema({
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
    image: {
        type: String,
    },
})

const WorkOrderTestDModel = model('workOrderTestD', workOrderTestDSchema)
module.exports = WorkOrderTestDModel
