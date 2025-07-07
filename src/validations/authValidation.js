const joi = require('joi')

const authValidation = {
    login: {
        body: joi.object({
            username: joi
                .string()
                .alphanum()
                .min(3)
                .max(50)
                .required()
                .messages({
                    'string.empty': 'Tên đăng nhập là bắt buộc',
                    'string.alphanum':
                        'Tên đăng nhập chỉ được chứa chữ cái và số',
                    'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
                    'string.max': 'Tên đăng nhập không được vượt quá 50 ký tự',
                    'any.required': 'Tên đăng nhập là bắt buộc',
                }),
            password: joi
                .string()
                .pattern(/^(?=(.*[a-zA-Z]))(?=(.*\d))(?=(.*[\W_])).{3,30}$/)
                .required()
                .messages({
                    'string.empty': 'Mật khẩu là bắt buộc',
                    'string.pattern.base':
                        'Mật khẩu phải có ít nhất 1 chữ cái, 1 số, 1 ký tự đặc biệt và dài từ 3 đến 30 ký tự',
                    'any.required': 'Mật khẩu là bắt buộc',
                }),
        }),
    },
    changePassword: {
        body: joi.object({
            newPassword: joi
                .string()
                .pattern(/^(?=(.*[a-zA-Z]))(?=(.*\d))(?=(.*[\W_])).{3,30}$/)
                .required()
                .messages({
                    'string.empty': 'Mật khẩu mới là bắt buộc',
                    'string.pattern.base':
                        'Mật khẩu mới phải có ít nhất 1 chữ cái, 1 số, 1 ký tự đặc biệt và dài từ 3 đến 30 ký tự',
                    'any.required': 'Mật khẩu mới là bắt buộc',
                }),
        }),
    },
}

module.exports = authValidation
