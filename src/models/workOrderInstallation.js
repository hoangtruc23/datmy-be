const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')

const workOrderInstallationSchema = new Schema(
    {
        workOrderId: {
            type: Types.ObjectId,
            required: true,
            ref: 'workOrders',
        },
        warrantyTime: { //Thời gian bảo hành
            type: Number,
            default: null,
        },
        deliveryDate: { //Ngày giao máy
            type: Date,
            default: null,
        },
        installDate: { // Ngày lắp đặt
            type: Date,
            default: null,
        },
        handOverDate: {  // Ngày bàn giao nghiệm thu
            type: Date,
            default: null,
        },
        machineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        // machineInfo: [propSchema],
        machineSpecs: [propSchema],
        // includedAccessories: [String],
        guide: {
            turningMachine: [String], //Thao tác tắt mở máy
            inkjetProgramming: [String], //Lập trình in phun
            inkjetSetting: [String], //Cài đặt in phun
            saveProgram: [String], //Lưu chương trình
            inkReplace: [String],// Cách thay mực
            ITMTime: { //Thời gian ITM
                type: Boolean,
                default: null,
            },
            viewSpecifications: [String], //Xem thông số máy
            errorMessages: [String], //Các báo lỗi của máy
        },
    },
    { timestamps: true },
)

const WorkOrderInstallationModel = model(
    'workOrderInstallation',
    workOrderInstallationSchema,
)
module.exports = WorkOrderInstallationModel
