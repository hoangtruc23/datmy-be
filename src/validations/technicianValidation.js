const joi = require('joi')
const constant = require('../utils/constant/constant')

const technicianValidation = {
    getAll: {
        query: joi
            .object({
                status: joi
                    .string()
                    .valid(
                        ...Object.values(constant.TECHNICIAN_STATUS).map(
                            (s) => s.value,
                        ),
                    )
                    .required()
                    .messages({
                        'any.only':
                            "Tình trạng của phiếu chỉ bao gồm 'free', 'working'",
                        'any.required': 'Tình trạng của phiếu là bắt buộc',
                    }),
            })
            .unknown(true),
    },
    getById: {},
    getOverall: {},
    create: {
        body: joi
            .object({
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
                    .pattern(/^[a-zA-Z0-9_]+$/)
                    .min(3)
                    .max(30)
                    .required()
                    .messages({
                        'string.empty': 'Tên đăng nhập là bắt buộc',
                        'string.pattern.base':
                            'Tên đăng nhập chỉ được chứa chữ cái và số',
                        'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
                        'string.max':
                            'Tên đăng nhập không được vượt quá 30 ký tự',
                        'any.required': 'Tên đăng nhập là bắt buộc',
                    }),
                // email: joi
                //     .string()
                //     .email({ tlds: { allow: false } })
                //     .required()
                //     .messages({
                //         'string.empty': 'Email là bắt buộc',
                //         'string.email': 'Email không đúng định dạng',
                //         'any.required': 'Email là bắt buộc',
                //     }),
                // phoneNumber: joi
                //     .string()
                //     .pattern(/^[0-9]{4,15}$/)
                //     .required()
                //     .messages({
                //         'string.empty': 'Số điện thoại là bắt buộc',
                //         'string.pattern.base':
                //             'Số điện thoại phải có từ 4 đến 15 chữ số',
                //         'any.required': 'Số điện thoại là bắt buộc',
                //     }),
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
            })
            .unknown(true),
    },
    update: {
        body: joi
            .object({
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
                    .pattern(/^[a-zA-Z0-9_]+$/)
                    .min(3)
                    .max(30)
                    .messages({
                        'string.pattern.base':
                            'Tên đăng nhập chỉ được chứa chữ cái và số',
                        'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
                        'string.max':
                            'Tên đăng nhập không được vượt quá 30 ký tự',
                    }),
                email: joi
                    .string()
                    .email({ tlds: { allow: false } })
                    .messages({
                        'string.email': 'Email không đúng định dạng',
                    }),
                phoneNumber: joi
                    .string()
                    .pattern(/^[0-9]{4,15}$/)
                    .messages({
                        'string.pattern.base':
                            'Số điện thoại phải có từ 4 đến 15 chữ số',
                    }),
            })
            .unknown(true),
    },
    login: {
        body: joi.object({
            username: joi
                .string()
                .pattern(/^[a-zA-Z0-9_]+$/)
                .min(3)
                .max(50)
                .required()
                .messages({
                    'string.empty': 'Tên đăng nhập là bắt buộc',
                    'string.pattern.base':
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

module.exports = technicianValidation
