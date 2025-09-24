const { Schema, model } = require('mongoose')
const constant = require('../utils/constant/constant')

const technicianModel = new Schema(
    {
        code: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        area: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(constant.TECHNICIAN_STATUS),
            default: constant.TECHNICIAN_STATUS.AVAILABLE,
        },
        rate: {
            type: Number,
            min: 0,
            max: 5,
        },
        skills: {
            type: [
                {
                    type: String,
                    enum: Object.values(constant.TECHNICIAN_SKILL),
                },
            ],
            default: [],
        },
    },
    { timestamps: true },
)

const TechnicianModel = model('technicians', technicianModel)
module.exports = TechnicianModel
