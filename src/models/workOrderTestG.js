const { model, Types, Schema } = require('mongoose')
const { propSchema, testBaseSchema } = require('./workOrderDetailHelp')

const workOrderTestGSchema = new Schema(
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
        inkCode: {
            type: String,
            default: null,
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        // Serial controller và thông tin đầu in/đầu ghép
        serialControllerNumber: {
            type: String,
            default: null,
        },
        printHead: {
            type: String,
            default: null,
        },
        singleHeadCount: {
            type: Number,
            default: null,
        },
        compositeHeadCount: {
            type: Number,
            default: null,
        },
        serialPrintHeads: {
            type: [String],
            default: [],
        },

        props: [propSchema],
        image: {
            type: String,
            default: null,
        },
        printHeads: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true },
)


const WorkOrderTestGModel = model('workOrderTestG', workOrderTestGSchema)
module.exports = WorkOrderTestGModel
