const joi = require('joi')

const warehousesValidation = {
    getAll: {},
    getById: {},
    create: {
        body: joi
            .object({
                name: joi.string().trim().min(1).required().messages({
                    'string.empty': 'Tên kho hàng là bắt buộc',
                    'string.min': 'Tên kho hàng phải chứa ký tự',
                    'string.base': 'Tên kho hàng là bắt buộc',
                    'any.required': 'Tên kho hàng là bắt buộc',
                }),
                address: joi.string().trim().min(1).required().messages({
                    'string.empty': 'Địa chỉ kho hàng là bắt buộc',
                    'string.min': 'Địa chỉ kho hàng phải chứa ký tự',
                    'string.base': 'Địa chỉ kho hàng là bắt buộc',
                    'any.required': 'Địa chỉ kho hàng là bắt buộc',
                }),
            })
            .unknown(true),
    },
    update: {
        body: joi
            .object({
                name: joi.string().trim().min(1).required().messages({
                    'string.empty': 'Tên kho hàng là bắt buộc',
                    'string.min': 'Tên kho hàng phải chứa ký tự',
                    'string.base': 'Tên kho hàng là bắt buộc',
                    'any.required': 'Tên kho hàng là bắt buộc',
                }),
            })
            .unknown(true),
    },
    delete: {},
    changeActive: {},
}

module.exports = warehousesValidation
