// src/services/partnerService.js

const PartnerModel = require('../models/customer')
const errorCode = require('../utils/response/errorCode')
const BadReq = require('../utils/response/requestError')

const partnerService = {
    create: async (partnerData) => {
        try {
            // Check if tax code already exists, as it must be unique
            const checkTaxCode = await PartnerModel.findOne({ taxCode: partnerData.taxCode })
            if (checkTaxCode) {
                // You should define this new error code in your errorCode.js file
                throw new BadReq({ message: 'Mã số thuế đã tồn tại' })
            }
            
            const latestPartner = await PartnerModel.findOne().sort({ MKH: -1 });
            const newMKH = latestPartner ? latestPartner.MKH + 1 : 1;


            const newPartner = await PartnerModel.create({
                ...partnerData,
                MKH: newMKH, // Add the generated MKH
            })
            return newPartner
        } catch (error) {
            throw error
        }
    },
}

module.exports = partnerService