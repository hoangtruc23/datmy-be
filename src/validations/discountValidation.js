const joi = require('joi')
const constant = require('../utils/constant/constant')

const discountSchema = {
    type: joi
        .string()
        .valid(...Object.values(constant.DISCOUNT_TYPE))
        .required()
        .messages({
            'any.only': `Loại chiết khẩu chỉ bao gồm ${Object.values(
                constant.DISCOUNT_TYPE,
            ).join(', ')} `,
            'string.empty': 'Loại chiết khấu không được bỏ trông',
            'any.required': 'Loại chiết khấu không được bỏ trổng',
        }),
    value: joi.number().positive().required().messages({
        'number.base': 'Giá trị chiết khấu phải là số',
        'number.positive': 'Giá trị chiết khấu phải là số dương',
        'any.required': 'Giá trị chiết khấu không được bỏ trống',
    }),
}

const discountValidation = {
    create: {
        body: joi
            .object({
                ...discountSchema,
                invoiceId: joi
                    .string()
                    .pattern(/^[a-fA-F0-9]{24}$/)
                    .trim()
                    .required()
                    .messages({
                        'string.empty': 'Mã hóa dơn không được bỏ trống',
                        'string.pattern.base': 'Mã hóa đơn không hợp lệ',
                    }),
            })
            .unknown(true),
    },
    update: {
        body: joi
            .object({ ...discountSchema })
            .min(1)
            .messages({ 'object.min': 'Chưa có thông tin nào để cập nhật' })
            .unknown(true),
    },
}

module.exports = discountValidation
