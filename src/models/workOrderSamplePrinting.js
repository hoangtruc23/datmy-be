const { Types, model, Schema } = require('mongoose')
const { propSchema } = require('./workOrderDetailHelp')
const constant = require('../utils/constant/constant')

const workOrderSamplePrintingSchema = new Schema(
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
        inkTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },

        sellMachineTypeId: {
            type: Types.ObjectId,
            ref: 'products',
            default: null,
        },
        packagingMaterial: {
            type: String,
            default: null,
        },
        temperature: {
            type: Number,
            default: null,
        },
        method: {
            type: {
                name: {
                    type: String,
                    enum: Object.values(
                        constant.SAMPLE_PRINTING_METHOD_NAME,
                    ).map((i) => i.value),
                },
                speed: {
                    type: Number,
                },
            },
            default: null,
        },
        informationFrom: {
            type: String,
            enum: Object.values(constant.SAMPLE_PRINTING_INFORMATION_FROM).map(
                (i) => i.value,
            ),
            default: null,
        },
        customerRequest: {
            type: String,
            default: null,
        },
        managerOpinion: {
            type: String,
            default: null,
        },
        solution: {
            type: String,
            default: null,
        },
        testInkTypeIds: [
            {
                type: Types.ObjectId,
                ref: 'products',
            },
        ],
        managerOpinionOnSample: {
            type: String,
            default: null,
        },
        receivingTime: {
            type: Date,
            default: null,
        },
        returnTime: {
            type: Date,
            default: null,
        },
        note: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
)

const WorkOrderSamplePrintingModel = model(
    'workOrderSamplePrinting',
    workOrderSamplePrintingSchema,
)
module.exports = WorkOrderSamplePrintingModel
