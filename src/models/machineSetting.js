const { Schema, model, Types } = require('mongoose')

const machineSettingSchema = new Schema(
    {
        workType: { // Loại phiếu
            type: String,
            required: true,
        },
        nameType: { // Tên dòng máy -> A,B,C,D,..
            type: String,
            required: true,
        },
        props: [{  // Thuộc tính
            // type: Types.ObjectId,
            type: Schema.Types.Mixed,
            ref: 'machineProperties',
            required: false,
        }],
    },
    { timestamps: true },
)

const MachineSettingModel = model('machineSettings', machineSettingSchema)

module.exports = MachineSettingModel


