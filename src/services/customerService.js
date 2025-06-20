// src/services/customerService.js

const CustomerModel = require('../models/customer')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const customerService = {
    create: async (customerData) => {
        try {
            // Check if tax code already exists, as it must be unique
            const checkTaxCode = await CustomerModel.findOne({
                taxCode: customerData.taxCode,
            })
            if (checkTaxCode) {
                throw new BadReq(errorCode.TAXCODE_EXISTED)
            }

            const latestCustomer = await CustomerModel.findOne().sort({
                code: -1,
            })
            const newCode = latestCustomer ? latestCustomer.code + 1 : 1

            const newCustomer = await CustomerModel.create({
                ...customerData,
                code: newCode, // Add the generated MKH
            })
            return newCustomer
        } catch (error) {
            throw error
        }
    },

    update: async (id, customerData) => {
        try {
            const currentCustomer = await CustomerModel.findById(id)
            if (!currentCustomer) {
                throw new BadReq(errorCode.CUSTOMER_NOT_FOUND)
            }

            // Check if the new taxCode is being used by another customer
            if (
                customerData.taxCode &&
                customerData.taxCode !== currentCustomer.taxCode
            ) {
                const conflict = await CustomerModel.findOne({
                    taxCode: customerData.taxCode,
                })
                if (conflict) {
                    throw new BadReq(errorCode.TAXCODE_EXISTED)
                }
            }

            // Apply the updates from customerData to the found customer document
            currentCustomer.set(customerData)
            const updatedCustomer = await currentCustomer.save()

            return updatedCustomer
        } catch (error) {
            throw error
        }
    },
}

module.exports = customerService
