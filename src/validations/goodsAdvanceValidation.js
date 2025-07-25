const joi = require('joi')

const customDateValidation = (value, helpers) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (value < today) {
        return helpers.error('date.min')
    }
    return value
}

const goodsAdvanceValidation = {
    create: {
        body: joi
            .object({
                expectedReturnDate: joi
                    .date()
                    .custom(customDateValidation, 'custom date validation')
                    .required()
                    .messages({
                        'date.min':
                            'Ngày trả hàng dự kiến không được là một ngày trong quá khứ',
                        'any.required': 'Ngày trả hàng dự kiến là bắt buộc',
                    }),
            })
            .unknown(true),
    },
    update: {
        body: joi
            .object({
                expectedReturnDate: joi
                    .date()
                    .custom(customDateValidation, 'custom date validation')
                    .required()
                    .messages({
                        'date.min':
                            'Ngày trả hàng dự kiến không được là một ngày trong quá khứ',
                        'any.required': 'Ngày trả hàng dự kiến là bắt buộc',
                    }),
            })
            .unknown(true),
    },
    extend: {
        body: joi
            .object({
                extendedReturnDate: joi
                    .date()
                    .custom(customDateValidation, 'custom date validation')
                    .required()
                    .messages({
                        'date.min':
                            'Ngày gia hạn không được là một ngày trong quá khứ',
                        'any.required': 'Ngày gia hạn là bắt buộc',
                    }),
                note: joi.string().required().messages({
                    'any.required': 'Lí do gia hạn là bắt buộc',
                }),
            })
            .unknown(true),
    },
}

module.exports = goodsAdvanceValidation
