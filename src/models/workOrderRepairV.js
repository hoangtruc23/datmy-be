const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderRepairVSchema = new Schema(
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
        ribbonType: { //Loại ruy băng
            type: String,
            default: null,
        },
        printHeadDirection: { // Hướng đầu in
            type: String,
            default: null,
        },
        machineTime: { //Thời gian máy
            type: String,
            default: null,
        },
        installationDate: { //Ngày lắp đặt
            type: Date,
            required: false,
        },
        machineInfo: [propSchema],
        machineSpecs: [propSchema],
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
    },
    { timestamps: true },
)

const WorkOrderRepairVModel = model('workOrderRepairV', workOrderRepairVSchema)
module.exports = WorkOrderRepairVModel
