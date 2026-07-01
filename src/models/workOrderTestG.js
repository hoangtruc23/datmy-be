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
        props: [propSchema],
        image: {
            type: String,
            default: null,
        },
        printHeads: [printHeadSchema],
    },
    { timestamps: true },
)


const WorkOrderTestGModel = model('workOrderTestG', workOrderTestGSchema)
module.exports = WorkOrderTestGModel
