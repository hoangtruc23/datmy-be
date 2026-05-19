const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderMaintainDSchema = new Schema(
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
        controllerTime: { // Thời gian Controller
            type: String,
            default: null,
        },
        laserHeadTime: { // Thời gian Laser head
            type: String,
            default: null,
        },
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
        machineSpecs: [propSchema], //Thông số
        differentApproach: [String], //Thao tác xử lý
        failureSituation: [String], //Tình trạng sự cố máy
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
        }
    },
    { timestamps: true },
)

const WorkOrderMaintainDModel = model(
    'workOrderMaintainD',
    workOrderMaintainDSchema,
)
module.exports = WorkOrderMaintainDModel
