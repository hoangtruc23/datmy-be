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
        message: 'Định dạng hình ảnh nên là jpg, jpeg hoặc png!',
    },
    FILE_INCORECT_FORMAT: {
        code: 9,
        message:
            'Định dạng file nên là  pdf, powerpoint, docx, xlsx, csv, png, jpeg!',
    },
    BRAND_EXISTED: {
        code: 13,
        message: 'Thương hiệu đã tồn tại',
    },
    BRAND_NOT_FOUND: {
        code: 14,
        message: 'Thương hiệu không tồn tại',
    },

    PRODUCT_CATEGORY_EXISTED: {
        code: 15,
        message: 'Danh mục sản phẩm đã tồn tại',
    },
    PRODUCT_CATEGORY_NOT_FOUND: {
        code: 16,
        message: 'Danh mục sản phẩm không tồn tại',
    },
    PRODUCT_EXISTED: {
        code: 17,
        message: 'Sản phẩm đã tồn tại',
    },
    PRODUCT_NOT_FOUND: {
        code: 18,
        message: 'Sản phẩm không tồn tại',
    },
    PRODUCT_CODE_EXISTED: {
        code: 19,
        message: 'Mã sản phẩm đã tồn tại',
    },
    PRODUCT_CANNOT_CHANGE_MANAGEMENT_TYPE: {
        code: 20,
        message: 'Không thể thay đổi loại quản lý của sản phẩm đã có trong kho',
    },
}

module.exports = errorCode
