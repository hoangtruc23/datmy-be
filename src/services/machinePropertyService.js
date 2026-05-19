const MachinePropertyModel = require("../models/machineProperties")
const errorCode = require("../utils/response/errorCode")
const BadReq = require("../utils/response/requestError")

const machinePropertyService = {
    create: async (property) => {
        try {
            const { name, type } = property
            const checkProperty = await MachinePropertyModel.findOne({ name, type })
            if (checkProperty) {
                throw new BadReq(errorCode.MACHINE_PROPERTY_EXISTED)
            }
            await MachinePropertyModel.create(property)
            return null
        } catch (error) {
            throw error
        }
    },
    update: async (params, property) => {
        try {
            const { id } = params
            // const { name, type } = property
            // const checkProperty = await MachinePropertyModel.findOne({ name, type })
            // if (!checkProperty) {
            //     throw new BadReq(errorCode.MACHINE_PROPERTIES_NOT_FOUND)
            // }
            await MachinePropertyModel.findByIdAndUpdate(id, property)
            return null
        } catch (error) {
            throw error
        }
    },
    delete: async (params) => {
        try {
            const { id } = params
            await MachinePropertyModel.findByIdAndDelete(id)
            return null
        } catch (error) {
            throw error
        }
    }
}

module.exports = machinePropertyService