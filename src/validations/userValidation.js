const joi = require('joi')

const userValidation = {
    getAll: {},
    getById: {},
    create: {
        body: joi.object({
            fullname: joi
                .string()
                .trim()
                .min(2)
                .max(100)
                .pattern(/^[a-zA-ZÀ-ỹ\s']+$/u)
                .required()
                .messages({
                    'string.empty': 'Họ tên là bắt buộc',
                    'string.min': 'Họ tên phải có ít nhất 2 ký tự',
                    'string.max': 'Họ tên không được vượt quá 100 ký tự',
                    'string.pattern.base':
                        'Họ tên chỉ được chứa chữ cái và khoảng trắng',
                    'any.required': 'Họ tên là bắt buộc',
                }),
            username: joi
                .string()
                .alphanum()
                .min(3)
                .max(30)
                .required()
                .messages({
                    'string.empty': 'Tên đăng nhập là bắt buộc',
                    'string.alphanum':
                        'Tên đăng nhập chỉ được chứa chữ cái và số',
                    'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
                    'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
                    'any.required': 'Tên đăng nhập là bắt buộc',
                }),
            email: joi
                .string()
                .email({ tlds: { allow: false } })
                .required()
                .messages({
                    'string.empty': 'Email là bắt buộc',
                    'string.email': 'Email không đúng định dạng',
                    'any.required': 'Email là bắt buộc',
                }),
            phoneNumber: joi
                .string()
                .pattern(/^[0-9]{10,15}$/)
                .required()
                .messages({
                    'string.empty': 'Số điện thoại là bắt buộc',
                    'string.pattern.base':
                        'Số điện thoại phải có từ 10 đến 15 chữ số',
                    'any.required': 'Số điện thoại là bắt buộc',
                }),
            password: joi
                .string()
                .pattern(/^(?=(.*[a-zA-Z]))(?=(.*\d))(?=(.*[\W_])).{3,30}$/)
                .required()
                .messages({
                    'string.empty': 'Mật khẩu là bắt buộc',
                    'string.pattern.base':
                        'Mật khẩu phải có ít nhất 1 chữ cái, 1 số, 1 ký tự đặc biệt và độ dài từ 3–30 ký tự',
                    'any.required': 'Mật khẩu là bắt buộc',
                }),
            roleIds: joi.array().items(joi.string()).min(1).required().messages({
                'array.base': 'Quyền phải là một mảng',
                'array.includes': 'Mỗi quyền phải là một chuỗi',
                'array.min': 'Phải có ít nhất một quyền',
                'any.required': 'Quyền là bắt buộc',
            }),
        }),
    },
        update: {
        body: joi.object({
            fullname: joi
                .string()
                .trim()
                .min(2)
                .max(100)
                .pattern(/^[a-zA-ZÀ-ỹ\s']+$/u)
                .messages({ 
                    'string.min': 'Họ tên phải có ít nhất 2 ký tự',
                    'string.max': 'Họ tên không được vượt quá 100 ký tự',
                    'string.pattern.base':
                        'Họ tên chỉ được chứa chữ cái và khoảng trắng',
                 }),
            username: joi
                .string()
                .alphanum()
                .min(3)
                .max(30)
                .messages({ 
                    'string.alphanum':
                        'Tên đăng nhập chỉ được chứa chữ cái và số',
                    'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
                    'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
                }),
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
            roleIds: joi.array().items(joi.string()).min(1).messages({'array.min': 'Phải có ít nhất một quyền', }),
        }),
    },
    changePassword: {},
    changeActiveStatus: {},
    delete: {},
}

module.exports = userValidation
