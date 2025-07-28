const joi = require('joi')

const customDateValidation = (value, helpers) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (value < today) {
        return helpers.error('date.min')
    }
    return value
}

const goodsReceiptValidation = {
    create: {
        body: joi
            .object({
                estimatedDeliveryDate: joi
                    .date()
                    .custom(customDateValidation, 'custom date validation')
                    .required()
                    .messages({
                        'date.min':
                            'Ngày giao hàng dự kiến không được là một ngày trong quá khứ',
                        'any.required': 'Ngày giao hàng dự kiến là bắt buộc',
                    }),
            })
            .unknown(true),
    },
    update: {
        body: joi
            .object({
                estimatedDeliveryDate: joi
                    .date()
                    .custom(customDateValidation, 'custom date validation')
                    .required()
                    .messages({
                        'date.min':
                            'Ngày giao hàng dự kiến không được là một ngày trong quá khứ',
                        'any.required': 'Ngày giao hàng dự kiến là bắt buộc',
                    }),
            })
            .unknown(true),
    },
}

module.exports = goodsReceiptValidation
