const joi = require('joi')
const constant = require('../utils/constant/constant')
const workOrderValidation = {
    getAll: {
        query: joi
            .object({
                status: joi
                    .string()
                    .valid(
                        ...Object.values(constant.WORK_REQUEST_STATUS).map(
                            (s) => s.value,
                        ),
                    )
                    .required()
                    .messages({
                        'any.only':
                            "Tình trạng của phiếu chỉ bao gồm 'pending', 'inProgress', 'completed', 'overdue'",
                        'any.required': 'Tình trạng của phiếu là bắt buộc',
                    }),
            })
            .unknown(true),
    },
    create: {
        body: joi
            .object({
                header: joi.string().trim().min(1).required().messages({
                    '*': 'Tiêu đề công việc là bắt buộc',
                }),
                typeWork: joi
                    .string()
                    .valid(...Object.values(constant.WORK_TYPE_1))
                    .messages({
                        'any.only':
                            "typeWork chỉ bao gồm '', 'repair', 'maintenance', 'installation', 'testIO', 'demo', 'samplePrinting'",
                    }),
                contactName: joi.string().trim().min(1).required().messages({
                    '*': 'Tên người liên hệ là bắt buộc',
                }),
                
                description: joi.string().trim().min(1).required().messages({
                    '*': 'Mô tả công việc là bắt buộc',
                }),
                priority: joi
                    .string()
                    .valid(
                        ...Object.values(constant.WORK_REQUEST_PRIORITY).map(
                            (s) => s.value,
                        ),
                    )
                    .required()
                    .messages({
                        'any.only':
                            "priority chỉ bao gồm 'high', 'medium', 'low'",
                        'any.required': 'priority là bắt buộc',
                    }),
                estimatedTime: joi.number().positive().required().messages({
                    'number.base': 'Thời gian ước tính phải là số',
                    'number.positive': 'Thời gian ước tính phải lớn hơn 0',
                    'any.required': 'Thời gian ước tính là bắt buộc',
                }),
                overDueTime: joi.date().iso().required().messages({
                    'date.base': 'Ngày bắt đầu phải là ngày hợp lệ.',
                    'date.format': 'Ngày bắt đầu phải có định dạng ISO 8601.',
                    'any.required': 'Ngày bắt đầu là bắt buộc.',
                }),
                requestSource: joi
                    .string()
                    .valid(...Object.values(constant.WORK_REQUEST_SOURCE))
                    .messages({
                        'any.only':
                            "requestSource chỉ bao gồm 'customer', 'warehouse', 'demo'",
                    }),
            })
            .unknown(true),
    },
    update: {
        body: joi
            .object({
                header: joi.string().trim().min(1).required().messages({
                    '*': 'Tiêu đề công việc là bắt buộc',
                }),
                typeWork: joi
                    .string()
                    .valid(...Object.values(constant.WORK_TYPE_1))
                    .messages({
                        'any.only':
                            "typeWork chỉ bao gồm '', 'repair', 'maintenance', 'installation', 'testIO', 'demo', 'samplePrinting'",
                    }),
                type: joi
                    .string()
                    .valid(...Object.values(constant.WORK_TYPE_2))
                    .messages({
                        'any.only':
                            "type chỉ bao gồm '', 'D', 'G', 'V', 'M', 'A'",
                    }),
                description: joi.string().trim().min(1).required().messages({
                    '*': 'Mô tả công việc là bắt buộc',
                }),
                priority: joi
                    .string()
                    .valid(
                        ...Object.values(constant.WORK_REQUEST_PRIORITY).map(
                            (s) => s.value,
                        ),
                    )
                    .required()
                    .messages({
                        'any.only':
                            "priority chỉ bao gồm 'high', 'medium', 'low'",
                        'any.required': 'Loại ưu tiên là bắt buộc',
                    }),
                estimatedTime: joi.number().positive().required().messages({
                    'number.base': 'Thời gian ước tính phải là số',
                    'number.positive': 'Thời gian ước tính phải lớn hơn 0',
                    'any.required': 'Thời gian ước tính là bắt buộc',
                }),
                overDueTime: joi.date().iso().required().messages({
                    'date.base': 'Ngày bắt đầu phải là ngày hợp lệ.',
                    'date.format': 'Ngày bắt đầu phải có định dạng ISO 8601.',
                    'any.required': 'Ngày bắt đầu là bắt buộc.',
                }),
                requestSource: joi
                    .string()
                    .valid(...Object.values(constant.WORK_REQUEST_SOURCE))
                    .messages({
                        'any.only':
                            "requestSource chỉ bao gồm 'customer', 'warehouse', 'demo'",
                    }),
                status: joi
                    .string()
                    .valid(
                        ...Object.values(constant.WORK_REQUEST_STATUS).map(
                            (s) => s.value,
                        ),
                    )
                    .messages({
                        'any.only':
                            "status chỉ bao gồm 'pending', 'inProgress', 'completed', 'overdue'",
                    }),
            })
            .unknown(true),
    },
}
module.exports = workOrderValidation
