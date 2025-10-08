const joi = require('joi')
const constant = require('../utils/constant/constant')

const discountValidation = {
    create: {
        body: joi
            .object({
                amount: joi.number().positive().required().messages({
                    'number.base': 'Giá trị chiết khấu phải là số',
                    'number.positive': 'Giá trị chiết khấu phải là số dương',
                    'any.required': 'Giá trị chiết khấu không được bỏ trống',
                }),
                customerId: joi
                    .string()
                    .pattern(/^[a-fA-F0-9]{24}$/)
                    .trim()
                    .required()
                    .messages({
                        'string.empty': 'Mã khách hàng không được bỏ trống',
                        'string.pattern.base': 'Mã khách hàng không hợp lệ',
                    }),
                productId: joi
                    .string()
                    .pattern(/^[a-fA-F0-9]{24}$/)
                    .trim()
                    .required()
                    .messages({
                        'string.empty': 'Mã sản phẩm không được bỏ trống',
                        'string.pattern.base': 'Mã sản phẩm không hợp lệ',
                    }),
            })
            .unknown(true),
    },
    update: {
        body: joi
            .object({
                amount: joi.number().positive().required().messages({
                    'number.base': 'Giá trị chiết khấu phải là số',
                    'number.positive': 'Giá trị chiết khấu phải là số dương',
                    'any.required': 'Giá trị chiết khấu không được bỏ trống',
                }),
                customerId: joi
                    .string()
                    .pattern(/^[a-fA-F0-9]{24}$/)
                    .trim()
                    .required()
                    .messages({
                        'string.empty': 'Mã khách hàng không được bỏ trống',
                        'string.pattern.base': 'Mã khách hàng không hợp lệ',
                    }),
                productId: joi
                    .string()
                    .pattern(/^[a-fA-F0-9]{24}$/)
                    .trim()
                    .required()
                    .messages({
                        'string.empty': 'Mã sản phẩm không được bỏ trống',
                        'string.pattern.base': 'Mã sản phẩm không hợp lệ',
                    }),
            })
            .min(1)
            .messages({ 'object.min': 'Chưa có thông tin nào để cập nhật' })
            .unknown(true),
    },
}

module.exports = discountValidation
