const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const technicianModel = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: 'users',
        },
        code: {
            type: String,
            required: true,
        },
        area: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(constant.TECHNICIAN_STATUS),
            default: constant.TECHNICIAN_STATUS.FREE,
        },
    },
    { timestamps: true },
)

const TechnicianModel = model('technicians', technicianModel)
module.exports = TechnicianModel
