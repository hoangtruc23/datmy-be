const joi = require('joi')

const contactPersonSchema = joi.object({
    name: joi.string().required().messages({
        'string.empty': 'Tên người liên hệ là bắt buộc',
        'any.required': 'Tên người liên hệ là bắt buộc',
    }),
    phone: joi.string().allow('', null).optional(),
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

const supplierBaseSchema = {
    // type: joi.string().valid('customer', 'supplier').required(),
    //MKH: joi.number().required(),
    name: joi.string().required().messages({
        'string.empty': 'Tên là bắt buộc',
        'any.required': 'Tên là bắt buộc',
    }),
    officialName: joi.string().required().messages({
        'string.empty': 'Tên đầy đủ là bắt buộc',
        'any.required': 'Tên đầy đủ là bắt buộc',
    }),
    taxCode: joi
        .string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
            'string.empty': 'Mã số thuế là bắt buộc',
            'string.pattern.base':
                'Mã số thuế phải có ít nhất 10 chữ số, và phải là chữ số',
            'any.required': 'Mã số thuế là bắt buộc',
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
    phone: joi.string().allow('', null).optional(),
    billingAddress: joi.string().required().messages({
        'string.empty': 'Địa chỉ xuất hóa đơn là bắt buộc',
        'any.required': 'Địa chỉ xuất hóa đơn là bắt buộc',
    }),
    garageAddress: joi.string().allow('', null),
    deliveryAddresses: joi
        .array()
        .items(deliveryAddressSchema)
        .min(1)
        .max(5)
        .required()
        .messages({
            'array.min': 'Phải có ít nhất 1 địa chỉ giao hàng',
            'array.max': 'Không được nhiều hơn 5 địa chỉ giao hàng',
            'any.required': 'Danh sách địa chỉ giao hàng là bắt buộc',
        }),

    contactPersons: joi.object({
        warehouseAccountant: joi.array().items(contactPersonSchema),
        sale: joi.array().items(contactPersonSchema),
        accountant: joi.array().items(contactPersonSchema),
        tech: joi.array().items(contactPersonSchema),
        debtAccountant: joi.array().items(contactPersonSchema),
        billAccountant: joi.array().items(contactPersonSchema),
    }),
    notes: joi.string().allow('', null),
    purchaseCycleInWeeks: joi.number().allow(null),
    internalTransport: joi.boolean().default(false),
    productsInUse: joi.array().items(joi.string()),
    status: joi.string().valid('none', 'met', 'notMet').default('none'),
    isActive: joi.boolean().default(true),
}

const supplierValidation = {
    create: {
        body: joi
            .object({
                ...supplierBaseSchema,
            })
            .unknown(true),
    },
    update: {
        body: joi
            .object({
                ...supplierBaseSchema,
                code: joi.forbidden(),
            })
            .unknown(true),
    },
}

module.exports = supplierValidation
