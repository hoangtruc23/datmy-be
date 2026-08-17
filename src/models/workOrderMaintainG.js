const { Types, model, Schema } = require('mongoose')
const { propSchema, groupSchema } = require('./workOrderDetailHelp')

const workOrderMaintainGSchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        machineInfo: [propSchema],
        maintainContract: { //Hợp đồng bảo trì
            type: Boolean,
            default: null,
        },
        repairDate: { // Ngày sửa chữa
            type: Date,
            default: null
        },
        arrivalTime: { //Giờ đến
            type: String,
            default: null,
        },
        leavingTime: { //Giờ ra
            type: String,
            default: null,
        },
        workingTime: {// Thời gian sửa chữa
            type: String,
            default: null,
        },
        ambientTemperature: { //Nhiệt độ môi trường
            type: Number,
            default: null,
        },
        environmentHumidity: { //Độ ẩm môi trường
            type: Number,
            default: null,
        },
        dustLevel: { //Mức độ bụi bẩn
            type: String,
            default: null,
        },
        installationDate: { //Ngày lắp đặt
            type: Date,
            required: false,
        },
        printHead: {
            type: Number,
            required: false,
        },
        inkSupply: {
            type: String,
            required: false,
        },
        singlePrintHead: {
            type: Number,
            required: false,
        },
        compositePrintHead: {
            type: Number,
            required: false,
        },
        singleSerialNumber: [String],
        compositeSerialNumber: [String],
        machineSpecs: [propSchema],
        groups: [groupSchema],
        maintainOperations: [
            {
                _id: false,
                operationName: {
                    type: String,
                    required: true,
                },
                valueName: {
                    type: String,
                },
                value: {
                    type: Number,
                },
            },
        ],
        technicalFeedback: [String],
        customerFeedback: [String],
        status: {
            type: String,
            enum: ['active', 'cancelled'],
            default: 'active',
        },
    },
    { timestamps: true },
)

const WorkOrderMaintainGModel = model(
    'workOrderMaintainG',
    workOrderMaintainGSchema,
)
module.exports = WorkOrderMaintainGModel
