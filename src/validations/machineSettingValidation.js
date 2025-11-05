const joi = require('joi')

const objectIdPattern = /^[0-9a-fA-F]{24}$/
const propSchema = joi.object({
    propId: joi.string().trim().pattern(objectIdPattern).required().messages({
        'string.empty': 'ID của thuộc tính là bắt buộc',
        'any.required': 'ID của thuộc tính là bắt buộc',
        'string.pattern.base':
            'ID của thuộc tính phải là ObjectId hợp lệ (24 ký tự hex)',
    }),

    defaultValue: joi
        .array()
        .items(
            joi.string().trim().min(1).messages({
                'string.empty': 'Giá trị mặc định không được để trống',
            }),
        )
        .min(1)
        .messages({
            'array.min': 'defaultValue phải có ít nhất 1 phần tử',
            'array.base': 'defaultValue phải là một mảng',
        })
        .optional(),
})

const machineSettingValidation = {
    create: {
        body: joi
            .object({
                machineId: joi
                    .string()
                    .trim()
                    .pattern(objectIdPattern)
                    .required()
                    .messages({
                        'string.empty': 'ID của máy là bắt buộc',
                        'any.required': 'ID của máy là bắt buộc',
                        'string.pattern.base':
                            'ID của thuộc tính phải là ObjectId hợp lệ (24 ký tự hex)',
                    }),

                props: joi
                    .array()
                    .items(propSchema)
                    .min(1)
                    .required()
                    .messages({
                        'array.min': 'Phải có ít nhất một thuộc tính (prop)',
                        'array.base': 'props phải là một mảng',
                        'any.required': 'Danh sách props là bắt buộc',
                    }),
            })
            .unknown(true),
    },

    update: {
        body: joi
            .object({
                machineId: joi
                    .string()
                    .trim()
                    .pattern(objectIdPattern)
                    .required()
                    .messages({
                        'string.empty': 'ID của máy là bắt buộc',
                        'any.required': 'ID của máy là bắt buộc',
                        'string.pattern.base':
                            'ID của thuộc tính phải là ObjectId hợp lệ (24 ký tự hex)',
                    }),

                props: joi
                    .array()
                    .items(propSchema)
                    .min(1)
                    .required()
                    .messages({
                        'array.min': 'Phải có ít nhất một thuộc tính (prop)',
                        'array.base': 'props phải là một mảng',
                        'any.required': 'Danh sách props là bắt buộc',
                    }),
            })
            .unknown(true),
    },
}

module.exports = machineSettingValidation
