const { model, Types, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderTestASchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        testDate: {
            type: Date,
            default: null,
        },
        technicalId: {
            type: Types.ObjectId,
            ref: 'technicians',
            default: null,
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        inkCode: { //Loại mực
            type: String,
            default: null,
        },
        props: [propSchema],
    },
    { timestamps: true },
)

const WorkOrderTestAModel = model('workOrderTestA', workOrderTestASchema)
module.exports = WorkOrderTestAModel
