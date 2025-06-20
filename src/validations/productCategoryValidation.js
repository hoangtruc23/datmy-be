const joi = require('joi')

const productCategoryBaseSchema = {
    image: joi.string().uri().optional().messages({
        'string.uri': 'Đường dẫn ảnh phải là một URL hợp lệ',
    }),
    name: joi.string().required().messages({
        'string.empty': 'Tên danh mục là bắt buộc',
        'any.required': 'Tên danh mục là bắt buộc',
    }),
    description: joi.string().optional(),
    isActive: joi.boolean().optional().default(true).messages({
        'boolean.base': 'Trạng thái hoạt động phải là một giá trị boolean',
    }),
}

const supplierValidation = {
    create: {
        body: joi.object({
            ...productCategoryBaseSchema,
        }),
    },
    update: {
        body: joi.object({
            ...productCategoryBaseSchema,
        }),
    },
}

module.exports = supplierValidation
