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
    }
}

module.exports = machinePropertyService