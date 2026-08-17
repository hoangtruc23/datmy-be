const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderRepairMSchema = new Schema(
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
        installationDate: { //Ngày lắp đặt
            type: Date,
            required: false,
        },
        serialControllerNumber: { // Số serial controller
            type: String,
            required: false,
        },
        adhesiveType: { // Loại tay dán
            type: String,
            required: false,
        },
        ribbonType: { // Loại ruy băng
            type: String,
            required: false,
        },
        labelSize: { // Kích thước nhãn
            type: String,
            required: false,
        },
        padSize: { // Kích thước pad
            type: String,
            required: false,
        },
        beltSpeed: { // Tốc độ chuyền
            type: String,
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
        status: {
            type: String,
            enum: ['active', 'cancelled'],
            default: 'active',
        },
    },
    { timestamps: true },
)

const WorkOrderRepairMModel = model('workOrderRepairM', workOrderRepairMSchema)
module.exports = WorkOrderRepairMModel
