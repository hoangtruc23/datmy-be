const { model, Types, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')
const constant = require('../utils/constant/constant')

const workOrderRepairASchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        maintainContract: { //Hợp đồng bảo trì
            type: Boolean,
            default: null,
        },
        installationDate: { //Ngày lắp đặt
            type: Date,
            required: false,
        },
        repairDate: { //Ngày sửa chữa
            type: Date,
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
        inkCode: { // Mã số mực
            type: String,
            default: null,
        },
        machineStartup: { // Thời gian mở máy
            type: String,
            default: null,
        },
        inkjetTime: { // Thời gian in phun
            type: String,
            default: null,
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        machineCode: {
            type: String,
        },
        machineSpecs: [propSchema], //Kỹ thuật điền thông tin sửa máy
        failureSituation: [String], //Tình trạng sự cố máy
        differentApproach: [String], //Thao tác xử lý
        technicalFeedback: [String], // Ý kiến kỹ thuật (Linh kiện đề xuất thay)
        replacement: [String], // Linh kiện đã thay
        customerFeedback: [String],
        evaluate: Number, //Đánh giá của khách hàng
        note: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
)

const WorkOrderRepairAModel = model('workOrderRepairA', workOrderRepairASchema)
module.exports = WorkOrderRepairAModel
