// src/services/customerService.js

const CustomerModel = require('../models/customer')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const customerService = {
    create: async (customerData) => {
        try {
            // Check if tax code already exists, as it must be unique
            const checkTaxCode = await CustomerModel.findOne({ taxCode: customerData.taxCode })
            if (checkTaxCode) {
                // You should define this new error code in your errorCode.js file
                throw new BadReq({ message: 'Mã số thuế đã tồn tại' })
            }
            
            const latestCustomer = await CustomerModel.findOne().sort({ code: -1 });
            const newCode = latestCustomer ? latestCustomer.code + 1 : 1;


            const newCustomer = await CustomerModel.create({
                ...customerData,
                code: newCode, // Add the generated MKH
            })
            return newCustomer
        } catch (error) {
            throw error
        }
    },
}

module.exports = customerService
