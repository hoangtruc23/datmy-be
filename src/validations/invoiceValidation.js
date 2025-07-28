const joi = require('joi')
const constant = require('../utils/constant/constant')

const contactPersonSchema = joi.object({
    name: joi.string().trim().required().messages({
        'string.empty': 'Tên người liên hệ là bắt buộc',
        'any.required': 'Tên người liên hệ là bắt buộc',
    }),
    phone: joi
        .string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
            'string.empty': 'Số điện thoại người liên hệ là bắt buộc',
            'string.pattern.base': 'Số điện thoại phải có từ 10 đến 15 chữ số',
            'any.required': 'Số điện thoại người liên hệ là bắt buộc',
        }),
})

const invoiceBaseSchema = {
    customerId: joi
        .string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.empty': 'Mã khách hàng là bắt buộc',
            'string.pattern.base': 'Mã khách hàng không hợp lệ',
        }),
    customerName: joi.string().trim().required().messages({
        'string.empty': 'Tên khách hàng là bắt buộc',
        'any.required': 'Tên khách hàng  là bắt buộc',
    }),
    limitDue: joi.number().integer().min(0).optional().messages({
        'number.base': 'Số ngày đáo hạn phải là số nguyên',
        'number.integer': 'Số ngày đáo hạn phải là số nguyên',
        'number.min': 'Số ngày đáo hạn không được nhỏ hơn 0',
    }),
    invoiceCode: joi.string().trim().required().messages({
        'string.empty': 'Mã hóa đơn là bắt buộc',
        'any.required': 'Mã hóa đơn là bắt buộc',
    }),
    totalAmount: joi.number().positive().required().messages({
        'number.base': 'Tổng nợ phải là số',
        'number.positive': 'Tổng nợ phải lớn hơn 0',
        'any.required': 'Tổng nợ là bắt buộc',
    }),
    orderBy: contactPersonSchema,
    accountant: contactPersonSchema,
    status: joi
        .string()
        .valid(...Object.values(constant.INVOICE_STATUS))
        .messages({
            'any.only': `Trạng thái phải là một trong: ${Object.values(
                constant.INVOICE_STATUS,
            ).join(', ')}`,
        }),
    reminderContact: contactPersonSchema,
    notes: joi.string().trim().allow('', null),
}

const invoiceValidation = {
    create: {
        body: joi.object({
            ...invoiceBaseSchema,
        }),
    },
    update: {
        body: joi
            .object({
                ...invoiceBaseSchema,
            })
            .min(1)
            .messages({
                'object.min': 'Bạn chưa thay đổi thông tin nào để cập nhật',
            }),
    },
}

module.exports = invoiceValidation
