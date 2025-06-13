const joi = require('joi')

const supplierValidation = {
    create: {
        body: joi.object({
            name: joi.string().required().messages({
                'string.empty': 'Tên nhà cung cấp là bắt buộc',
                'any.required': 'Tên nhà cung cấp là bắt buộc',
            }),
            trueName: joi.string().required().messages({
                'string.empty': 'Tên đầy đủ là bắt buộc',
                'any.required': 'Tên đầy đủ là bắt buộc',
            }),
            taxCode: joi.string().required().messages({
                'string.empty': 'Mã số thuế là bắt buộc',
                'any.required': 'Mã số thuế là bắt buộc',
            }),
            fax: joi.string().allow(null, ''),
            email: joi
                .string()
                .email({ tlds: { allow: false } })
                .messages({
                    'string.email': 'Email không đúng định dạng',
                }),
            phoneNumber: joi
                .string()
                .pattern(/^[0-9]{10,15}$/)
                .messages({
                    'string.pattern.base':
                        'Số điện thoại phải có từ 10 đến 15 chữ số',
                }),
            invoiceAddress: joi.string().allow(null, '').required().messages({
                'string.empty': 'Địa chỉ xuất hóa đơn là bắt buộc',
                'any.required': 'Địa chỉ xuất hóa đơn là bắt buộc',
            }),
            parkAddress: joi.string().allow(null, ''),
            deliveryAddress: joi.string().allow(null, '').required().messages({
                'string.empty': 'Địa chỉ giao hàng là bắt buộc',
                'any.required': 'Địa chỉ giao hàng là bắt buộc',
            }),
            representative: joi
                .object({
                    name: joi.string().required().messages({
                        'string.empty': 'Tên đại diện là bắt buộc',
                        'any.required': 'Tên đại diện là bắt buộc',
                    }),
                    position: joi.string().required().messages({
                        'string.empty': 'Chức danh người đại diện là bắt buộc',
                        'any.required': 'Chức danh người đại diện là bắt buộc',
                    }),
                    phone: joi
                        .string()
                        .pattern(/^[0-9]{10,15}$/)
                        .required()
                        .messages({
                            'string.empty':
                                'Số điện thoại người đại diện là bắt buộc',
                            'string.pattern.base':
                                'Số điện thoại người đại diện phải có từ 10 đến 15 chữ số',
                            'any.required':
                                'Số điện thoại người đại diện là bắt buộc',
                        }),
                })
                .required(),
            warehouse: joi.object({
                name: joi.string().allow(null, ''),
                phone: joi
                    .string()
                    .allow(null, '')
                    .pattern(/^[0-9]{10,15}$/)
                    .messages({
                        'string.pattern.base':
                            'Số điện thoại phải có từ 10 đến 15 chữ số',
                    }),
            }),
            sales: joi.object({
                name: joi.string().allow(null, ''),
                phone: joi
                    .string()
                    .allow(null, '')
                    .pattern(/^[0-9]{10,15}$/)
                    .messages({
                        'string.pattern.base':
                            'Số điện thoại phải có từ 10 đến 15 chữ số',
                    }),
            }),
            accounting1: joi.object({
                name: joi.string().allow(null, ''),
                phone: joi
                    .string()
                    .allow(null, '')
                    .pattern(/^[0-9]{10,15}$/)
                    .messages({
                        'string.pattern.base':
                            'Số điện thoại phải có từ 10 đến 15 chữ số',
                    }),
            }),
            accounting2: joi.object({
                name: joi.string().allow(null, ''),
                phone: joi
                    .string()
                    .allow(null, '')
                    .pattern(/^[0-9]{10,15}$/)
                    .messages({
                        'string.pattern.base':
                            'Số điện thoại phải có từ 10 đến 15 chữ số',
                    }),
            }),
            produce: joi.array().items(joi.string()),
            note: joi.string().allow(null, ''),
            purchase: joi.number().default(0),
            internalTransport: joi.boolean().default(false),
            transportAddress: joi.string().allow(null, ''),
            isActive: joi.boolean().default(true),
        }),
    },

    update: {
        body: joi.object({
            name: joi.string().required().messages({
                'string.empty': 'Tên nhà cung cấp là bắt buộc',
                'any.required': 'Tên nhà cung cấp là bắt buộc',
            }),
            trueName: joi.string().required().messages({
                'string.empty': 'Tên đầy đủ là bắt buộc',
                'any.required': 'Tên đầy đủ là bắt buộc',
            }),
            taxCode: joi.string().required().messages({
                'string.empty': 'Mã số thuế là bắt buộc',
                'any.required': 'Mã số thuế là bắt buộc',
            }),
            fax: joi.string().allow(null, ''),
            email: joi
                .string()
                .email({ tlds: { allow: false } })
                .messages({
                    'string.email': 'Email không đúng định dạng',
                }),
            phoneNumber: joi
                .string()
                .pattern(/^[0-9]{10,15}$/)
                .messages({
                    'string.pattern.base':
                        'Số điện thoại phải có từ 10 đến 15 chữ số',
                }),
            invoiceAddress: joi.string().allow(null, '').required().messages({
                'string.empty': 'Địa chỉ xuất hóa đơn là bắt buộc',
                'any.required': 'Địa chỉ xuất hóa đơn là bắt buộc',
            }),
            parkAddress: joi.string().allow(null, ''),
            deliveryAddress: joi.string().allow(null, '').required().messages({
                'string.empty': 'Địa chỉ giao hàng là bắt buộc',
                'any.required': 'Địa chỉ giao hàng là bắt buộc',
            }),
            representative: joi
                .object({
                    name: joi.string().required().messages({
                        'string.empty': 'Tên đại diện là bắt buộc',
                        'any.required': 'Tên đại diện là bắt buộc',
                    }),
                    position: joi.string().required().messages({
                        'string.empty': 'Chức danh người đại diện là bắt buộc',
                        'any.required': 'Chức danh người đại diện là bắt buộc',
                    }),
                    phone: joi
                        .string()
                        .pattern(/^[0-9]{10,15}$/)
                        .required()
                        .messages({
                            'string.empty':
                                'Số điện thoại người đại diện là bắt buộc',
                            'string.pattern.base':
                                'Số điện thoại người đại diện phải có từ 10 đến 15 chữ số',
                            'any.required':
                                'Số điện thoại người đại diện là bắt buộc',
                        }),
                })
                .required(),
            warehouse: joi.object({
                name: joi.string().allow(null, ''),
                phone: joi
                    .string()
                    .allow(null, '')
                    .pattern(/^[0-9]{10,15}$/)
                    .messages({
                        'string.pattern.base':
                            'Số điện thoại phải có từ 10 đến 15 chữ số',
                    }),
            }),
            sales: joi.object({
                name: joi.string().allow(null, ''),
                phone: joi
                    .string()
                    .allow(null, '')
                    .pattern(/^[0-9]{10,15}$/)
                    .messages({
                        'string.pattern.base':
                            'Số điện thoại phải có từ 10 đến 15 chữ số',
                    }),
            }),
            accounting1: joi.object({
                name: joi.string().allow(null, ''),
                phone: joi
                    .string()
                    .allow(null, '')
                    .pattern(/^[0-9]{10,15}$/)
                    .messages({
                        'string.pattern.base':
                            'Số điện thoại phải có từ 10 đến 15 chữ số',
                    }),
            }),
            accounting2: joi.object({
                name: joi.string().allow(null, ''),
                phone: joi
                    .string()
                    .allow(null, '')
                    .pattern(/^[0-9]{10,15}$/)
                    .messages({
                        'string.pattern.base':
                            'Số điện thoại phải có từ 10 đến 15 chữ số',
                    }),
            }),
            produce: joi.array().items(joi.string()),
            note: joi.string().allow(null, ''),
            purchase: joi.number().default(0),
            internalTransport: joi.boolean().default(false),
            transportAddress: joi.string().allow(null, ''),
            isActive: joi.boolean().default(true),
        }),
    },
}

module.exports = supplierValidation
