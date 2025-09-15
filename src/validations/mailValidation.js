const joi = require('joi')

const mailValidation = {
    configMailReceiver: {
        body: joi.object({
            receivers: joi
                .array()
                .items(joi.string().email())
                .min(1)
                .required()
                .messages({
                    'array.base': 'Receivers phải là một mảng',
                    'array.min':
                        'Phải có ít nhất 1 email trong danh sách receivers',
                    'string.email':
                        'Mỗi phần tử trong receivers phải là email hợp lệ',
                    'any.required': 'Trường receivers là bắt buộc',
                }),
        }),
    },
}
module.exports = mailValidation
