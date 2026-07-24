const { Schema, model, Types } = require('mongoose')
const constant = require('../utils/constant/constant')

const technicianModel = new Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true,
        },
        code: {
            type: String,
            required: true,
        },
        area: {
            type: String,
        },
        isSupervisor: {
            type: Boolean,
            required: false,
        },
        status: {
            type: String,
            enum: Object.values(constant.TECHNICIAN_STATUS).map((s) => s.value),
            default: constant.TECHNICIAN_STATUS.FREE.value,
        },
    },
    { timestamps: true },
)

const TechnicianModel = model('technicians', technicianModel)
module.exports = TechnicianModel
