const { model, Types, Schema } = require('mongoose')
const constant = require('../utils/constant/constant')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const workOrderTestVSchema = new Schema({
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

const WorkOrderTestVModel = model('workOrderTestV', workOrderTestVSchema)
module.exports = WorkOrderTestVModel
