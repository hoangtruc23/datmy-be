const { model, Types, Schema } = require('mongoose')
const constant = require('../utils/constant/constant')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const workOrderTestVSchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        baseInfo: {
            type: testBaseSchema,
            default: null,
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        props: [propSchema],
        image: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
)

const WorkOrderTestVModel = model('workOrderTestV', workOrderTestVSchema)
module.exports = WorkOrderTestVModel
