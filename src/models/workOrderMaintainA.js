const { model, Types, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderMaintainASchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        maintainContractDate: {
            type: Date,
            default: null,
        },
        maintainDate: {
            type: Date,
            default: null,
        },
        arrivalTime: {   //Giờ đến
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
        leavingTime: {
            type: String,
            default: null,
        },
        workingTime: {
            type: String,
            default: null,
        },
        machineTypeId: {
            type: String,
            ref: 'products',
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
        machineSpecs: [propSchema], //Thông số
        differentApproach: [String], //Thao tác xử lý
        technicalFeedback: [String], // Ý kiến kỹ thuật (Linh kiện đề xuất thay)
        replacement: [String], // Linh kiện đã thay
        customerFeedback: [String], //Ý kiến khách hàng 
        evaluate: Number, //Đánh giá khách hàng
        note: {
            type: String,
            default: null,
        },
        signature: {
            type: String,
            default: null
        },
        status: {
            type: String,
            enum: ['active', 'cancelled'],
            default: 'active',
        },
    },
    { timestamps: true },
)

const WorkOrderMaintainAModel = model(
    'workOrderMaintainA',
    workOrderMaintainASchema,
)
module.exports = WorkOrderMaintainAModel
