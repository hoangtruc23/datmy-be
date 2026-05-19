const { Types, model, Schema } = require('mongoose')
const { propSchema, groupSchema } = require('./workOrderDetailHelp')

const workOrderRepairGSchema = new Schema(
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

        failureSituation: [String],
        differentApproach: [String],
        replacement: [String],
        machineProps: {
            type: [Schema.Types.Mixed],
            default: []
        },
        machineInfo: [propSchema],
        machineSpecs: [propSchema],
        groups: [groupSchema],
        repairFault: [
            {
                _id: false,
                fault: {
                    type: String,
                    required: true,
                },
                resolution: {
                    type: String,
                    required: true,
                },
            },
        ],
        technicalFeedback: [String],
        customerFeedback: [String],
        evaluate: Number, //Đánh giá của khách hàng
        signature: {
            type: String,
            default: null
        }
    },
    { timestamps: true },
)

const WorkOrderRepairGModel = model('workOrderRepairG', workOrderRepairGSchema)
module.exports = WorkOrderRepairGModel
