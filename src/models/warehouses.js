const mongoose = require('mongoose')
const Schema = mongoose.Schema

const warehouseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
)

const WarehouseModel = mongoose.model('warehouses', warehouseSchema)

module.exports = WarehouseModel
