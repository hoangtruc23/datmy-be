const { model, Schema, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const machinePropertiesSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: constant.MACHINE_PROPERTIES_TYPE.TEXT,
    },
    childProp: [{ //Thuộc tính con của thuộc tính
        type: Schema.Types.Mixed,
        required: false,
    }]
})

const MachinePropertyModel = model(
    'machineProperties',
    machinePropertiesSchema,
)
module.exports = MachinePropertyModel
