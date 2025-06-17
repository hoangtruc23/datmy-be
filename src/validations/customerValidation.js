// src/validations/partnerValidation.js

const joi = require('joi')

const partnerValidation = {
    create: {
        body: joi.object({
            type: joi.string().valid('customer', 'supplier').required(),
            name: joi.string().required().messages({
                'string.empty': 'Tên là bắt buộc',
            }),
            officialName: joi.string().required().messages({
                'string.empty': 'Tên chính thức là bắt buộc',
            }),
            taxCode: joi.string().required().messages({
                'string.empty': 'Mã số thuế là bắt buộc',
            }),
            billingAddress: joi.string().required().messages({
                'string.empty': 'Địa chỉ xuất hóa đơn là bắt buộc',
            }),
            // Add other fields from your model here as needed
            // For now, we are just validating the most critical fields
        }),
    },
}

module.exports = partnerValidation