// src/validations/reportValidation.js
const joi = require('joi')

const reportValidation = {
    getDebtComparison: {
        query: joi.object({
            startDate: joi.date().iso().required().messages({
                'date.base': 'Ngày bắt đầu phải là ngày hợp lệ',
                'date.format': 'Ngày bắt đầu phải có định dạng ISO 8601',
                'any.required': 'Ngày bắt đầu là bắt buộc',
            }),
            endDate: joi
                .date()
                .iso()
                .min(joi.ref('startDate'))
                .required()
                .messages({
                    'date.base': 'Ngày kết thúc phải là ngày hợp lệ',
                    'date.format': 'Ngày kết thúc phải có định dạng ISO 8601',
                    'date.min': 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
                    'any.required': 'Ngày kết thúc là bắt buộc',
                }),
            customerId: joi
                .string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .optional()
                .messages({
                    'string.pattern.base': 'Mã khách hàng không hợp lệ',
                }),
        }),
    },
    getDebtDetail: {
        query: joi.object({
            startDate: joi.date().iso().required().messages({
                'date.base': 'Ngày bắt đầu phải là ngày hợp lệ',
                'date.format': 'Ngày bắt đầu phải có định dạng ISO 8601',
                'any.required': 'Ngày bắt đầu là bắt buộc',
            }),
            endDate: joi
                .date()
                .iso()
                .min(joi.ref('startDate'))
                .required()
                .messages({
                    'date.base': 'Ngày kết thúc phải là ngày hợp lệ',
                    'date.format': 'Ngày kết thúc phải có định dạng ISO 8601',
                    'date.min': 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
                    'any.required': 'Ngày kết thúc là bắt buộc',
                }),
            customerId: joi
                .string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .required()
                .messages({
                    'string.pattern.base': 'Mã khách hàng không hợp lệ',
                    'any.required': 'Mã khách hàng là bắt buộc',
                }),
        }),
    },
}

module.exports = reportValidation
