const { model, Schema, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const machinePropertiesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(constant.MACHINE_PROPERTIES_TYPE),
        default: constant.MACHINE_PROPERTIES_TYPE.NORMAL,
    },
    categoryLinkedName: {
        type: String,
        enum: Object.values(constant.CATEGORY_NAME).filter(
            (v) => v !== constant.CATEGORY_NAME.MACHINE,
        ),
    },
})

const MachinePropertiesModel = model(
    'machineProperties',
    machinePropertiesSchema,
)
module.exports = MachinePropertiesModel
