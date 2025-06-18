// src/services/customerService.js

const CustomerModel = require('../models/customer')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const customerService = {
    create: async (customerData) => {
        try {
            // Check if tax code already exists, as it must be unique
<<<<<<< HEAD
            const checkTaxCode = await CustomerModel.findOne({
                taxCode: customerData.taxCode,
            })
=======
            const checkTaxCode = await CustomerModel.findOne({ taxCode: customerData.taxCode })
>>>>>>> 7cce48f58ffbf5295c11b2fbd118b0eb09bf7f71
            if (checkTaxCode) {
                // You should define this new error code in your errorCode.js file
                throw new BadReq({ message: 'Mã số thuế đã tồn tại' })
            }
<<<<<<< HEAD

            const latestCustomer = await CustomerModel.findOne().sort({
                code: -1,
            })
            const newCode = latestCustomer ? latestCustomer.code + 1 : 1
=======
            
            const latestCustomer = await CustomerModel.findOne().sort({ code: -1 });
            const newCode = latestCustomer ? latestCustomer.code + 1 : 1;

>>>>>>> 7cce48f58ffbf5295c11b2fbd118b0eb09bf7f71

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

<<<<<<< HEAD
module.exports = customerService
=======
module.exports = customerService
>>>>>>> 7cce48f58ffbf5295c11b2fbd118b0eb09bf7f71
