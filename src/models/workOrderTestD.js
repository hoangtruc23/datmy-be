const { model, Types, Schema } = require('mongoose')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const workOrderTestDSchema = new Schema(
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
        // UI đôi khi gán các thông tin test ở top-level
        purposeTest: {
            type: String,
            default: null,
        },
        receiptDate: {
            type: Date,
            default: null,
        },
        testDate: {
            type: Date,
            default: null,
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        // Serial thiết bị
        serialControllerNumber: {
            type: String,
            default: null,
        },
        serialLaserHeadNumber: {
            type: String,
            default: null,
        },
        controllerTime: {
            type: String,
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


const WorkOrderTestDModel = model('workOrderTestD', workOrderTestDSchema)
module.exports = WorkOrderTestDModel
