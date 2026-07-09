const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderRepairDSchema = new Schema(
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
        machineSpecs: [propSchema],
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
        serialLaserHeadNumber: { // Số serial laser head
            type: String,
            required: false,
        },
        controllerTime: { // Thời gian Controller
            type: String,
            default: null,
        },
        laserHeadTime: { // Thời gian Laser head
            type: String,
            default: null,
        },
        // inkjetTime: { // Thời gian in phun
        //     type: String,
        //     default: null,
        // },
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
        failureSituation: [String],
        differentApproach: [String], //Thao tác xử lý
        technicalFeedback: [String], // Ý kiến kỹ thuật (Linh kiện đề xuất thay)
        replacement: [String], // Linh kiện đã thay
        customerFeedback: [String],
        evaluate: Number, //Đánh giá của khách hàng
    },
    { timestamps: true },
)

const WorkOrderRepairDModel = model('workOrderRepairD', workOrderRepairDSchema)
module.exports = WorkOrderRepairDModel
