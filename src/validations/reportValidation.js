const Joi = require('joi');
const { Types } = require('mongoose');

const objectId = (value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

const getSalesReport = {
    query: Joi.object({
        startDate: Joi.date().iso().required().messages({
            'date.base': 'Ngày bắt đầu phải là ngày hợp lệ.',
            'date.format': 'Ngày bắt đầu phải có định dạng ISO 8601.',
            'any.required': 'Ngày bắt đầu là bắt buộc.',
        }),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
            'date.base': 'Ngày kết thúc phải là ngày hợp lệ.',
            'date.format': 'Ngày kết thúc phải có định dạng ISO 8601.',
            'date.min': 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            'any.required': 'Ngày kết thúc là bắt buộc.',
        }),
        productId: Joi.string().custom(objectId, 'Mongo ObjectId').optional().allow('').messages({
             'any.invalid': 'ID sản phẩm không hợp lệ.',
        }),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
    }),
};

module.exports = {
    getSalesReport,
};