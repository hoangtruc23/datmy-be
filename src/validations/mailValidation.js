const joi = require('joi')

const mailValidation = {
    configMailReceiver: {
        body: joi.object({
            receiverIds: joi
                .array()
                .items(
                    joi
                        .string()
                        .regex(/^[0-9a-fA-F]{24}$/)
                        .message(
                            'Mỗi phần tử trong receivers phải là ObjectId hợp lệ',
                        ),
                )
                .min(1)
                .required()
                .messages({
                    'array.base': 'Receivers phải là một mảng',
                    'array.min':
                        'Phải có ít nhất 1 email trong danh sách receivers',
                    'any.required': 'Trường receivers là bắt buộc',
                }),
        }),
    },
}
module.exports = mailValidation
