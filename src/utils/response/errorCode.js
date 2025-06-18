const errorCode = {
    INCORRECT_USERNAME: {
        code: 2,
        message: 'Tên người dùng không chính xác!',
    },
    INCORRECT_PASSWORD: {
        code: 3,
        message: 'Mật khẩu không chính xác!',
    },
    USER_NOT_FOUND: { code: 4, message: 'Không tìm thấy người dùng!' },
    USER_EXISTED: { code: 5, message: 'Tên người dùng đã tồn tại!' },

    TAXCODE_EXISTED: {
        code: 6,
        message: 'Mã số thuế đã tồn tại!',
    },
    SUPPLIER_NOT_FOUND: {
        code: 7,
        message: 'Nhà cung cấp không tồn tại!',
    },

    WAREHOUSE_EXISTED: {
        code: 10,
        message: 'Kho hàng đã tồn tại.',
    },
    WAREHOUSE_NOT_FOUND: {
        code: 11,
        message: 'Kho hàng không tồn tại.',
    },
    FILE_NOT_UPLOADED: {
        code: 8,
        message: 'Không có file nào được upload!',
    },
    IMAGE_INCORECT_FORMAT: {
        code: 9,
        message: 'Định dạng hìn ảnh nên là jpg, jpeg hoặc png!',
    },
}

module.exports = errorCode
