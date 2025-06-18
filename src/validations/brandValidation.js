const joi = require('joi')

const brandValidation = {
    create: {
        body: joi
            .object({
                name: joi.string().trim().min(1).required().messages({
                    'string.empty': 'Tên thương hiệu là bắt buộc',
                    'string.min': 'Tên thương hiệu phải chứa ký tự',
                    'string.base': 'Tên thương hiệu là bắt buộc',
                    'any.required': 'Tên thương hiệu là bắt buộc',
                }),
            })
            .unknown(true),
    },
    getAll: {},
    getById: {},
    update: {
        body: joi
            .object({
                name: joi.string().trim().min(1).required().messages({
                    'string.empty': 'Tên thương hiệu là bắt buộc',
                    'string.min': 'Tên thương hiệu phải chứa ký tự',
                    'string.base': 'Tên thương hiệu là bắt buộc',
                    'any.required': 'Tên thương hiệu là bắt buộc',
                }),
            })
            .unknown(true),
    },
    changeActive: {},
    delete: {},
}

module.exports = brandValidation
