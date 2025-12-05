// src/validations/customerValidation.js --- CORRECTED VERSION

const joi = require('joi')

// Reusable sub-schemas remain the same
const contactPersonSchema = joi.object({
    name: joi.string().required().messages({
        'string.empty': 'Tên người liên hệ là bắt buộc',
        'any.required': 'Tên người liên hệ là bắt buộc',
    }),
    phone: joi.string().allow('', null).optional(),
    email: joi.string().allow('', null).optional(),
})

const deliveryAddressSchema = joi.object({
    street: joi.string().required().messages({
        'string.empty': 'Tên đường là bắt buộc',
        'any.required': 'Tên đường là bắt buộc',
    }),
    ward: joi.string().required().messages({
        'string.empty': 'Phường/Xã là bắt buộc',
        'any.required': 'Phường/Xã là bắt buộc',
    }),
    district: joi.string().required().messages({
        'string.empty': 'Quận/Huyện là bắt buộc',
        'any.required': 'Quận/Huyện là bắt buộc',
    }),
    city: joi.string().required().messages({
        'string.empty': 'Thành phố là bắt buộc',
        'any.required': 'Thành phố là bắt buộc',
    }),
    country: joi.string().required().messages({
        'string.empty': 'Quốc gia là bắt buộc',
        'any.required': 'Quốc gia là bắt buộc',
    }),
})

const customerBaseSchema = {
    name: joi.string().allow(null, ''),
    code: joi.string().trim().required().messages({
        'string.empty': 'Code không được để trống',
        'any.required': 'Code là bắt buộc',
    }),
    officialName: joi.string().required().messages({
        'string.empty': 'Tên đầy đủ là bắt buộc',
        'any.required': 'Tên đầy đủ là bắt buộc',
    }),
    taxCode: joi.string().allow(null, ''),
    billingAddress: joi.string().required().messages({
        'string.empty': 'Địa chỉ xuất hóa đơn là bắt buộc',
        'any.required': 'Địa chỉ xuất hóa đơn là bắt buộc',
    }),
    deliveryAddresses: joi
        .array()
        .items(deliveryAddressSchema)
        .min(0)
        .max(5)
        .allow(null)
        .default([])
        .messages({
            'array.max': 'Không được nhiều hơn 5 địa chỉ giao hàng',
        }),
    fax: joi
        .any()
        .custom((value, helpers) => {
            let finalValue = value

            if (typeof finalValue === 'number') {
                finalValue = String(finalValue)
            }

            if (finalValue === null || finalValue === '') {
                return finalValue
            }

            if (typeof finalValue !== 'string') {
                return helpers.error('string.base')
            }

            return finalValue
        })
        .messages({
            'string.base': '"fax" must be a string or a number',
        }),
    email: joi
        .string()
        .email({ tlds: { allow: false } })
        .allow('', null),
    garageAddress: joi.string().allow('', null),
    contactPersons: joi.object({
        warehouseAccountant: joi.array().items(contactPersonSchema),
        sale: joi.array().items(contactPersonSchema),
        debt: joi.array().items(contactPersonSchema),
        accountant: joi.array().items(contactPersonSchema),
        tech: joi.array().items(contactPersonSchema),
        debtAccountant: joi.array().items(contactPersonSchema),
        billAccountant: joi.array().items(contactPersonSchema),
    }),
    groupCustomers: joi.string().allow(null, ''),
    CMND: joi.string().allow(null, ''),
    dateOfIssue: joi.date().allow(null, ''),
    placeOfIssue: joi.string().allow(null, ''),
    notes: joi.string().allow('', null),
    purchaseCycleInWeeks: joi.number().allow(null),
    internalTransport: joi.boolean().default(false),
    productsInUse: joi.array().items(joi.string()),
    status: joi.string().valid('none', 'met', 'not_met').default('none'),
    isActive: joi.boolean().default(true),
}

const customerValidation = {
    create: {
        body: joi
            .object({
                ...customerBaseSchema,
            })
            .unknown(true),
    },
    update: {
        body: joi
            .object({
                ...customerBaseSchema,
            })
            .unknown(true),
    },
}

module.exports = customerValidation
// tên, tên chính thức, code, địa chỉ bill, địa chỉ giao hàng (1-5)
