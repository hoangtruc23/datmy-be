const { Types, model, Schema } = require('mongoose')

const propSchema = new Schema({
    _id: false,
    propId: {
        type: Types.ObjectId,
        required: true,
        ref: 'productCategories',
    },
    defaultValue: {
        type: [String],
    },
})

const machineSettingSchema = new Schema(
    {
        machineId: {
            type: Types.ObjectId,
            required: true,
            ref: 'products',
        },
        props: {
            type: [propSchema],
            default: [],
        },
    },
    { timestamps: true },
)

const MachineSettingModel = model('machineSettings', machineSettingSchema)
module.exports = MachineSettingModel
