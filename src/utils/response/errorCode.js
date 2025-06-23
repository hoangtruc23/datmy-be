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
    GOODS_RECEIPT_NOT_FOUND: {
        code: 19,
        message: 'Phiếu nhập kho không tồn tại',
    },
    GOODS_RECEIPT_DETAIL_EXISTED: {
        code: 20,
        message: 'Sản phẩm được thêm đã tồn tại trong phiếu nhập kho',
    },
    GOODS_RECEIPT_DETAIL_NOT_FOUND: {
        code: 21,
        message: 'Không tìm thấy sản phẩm này trong phiếu nhập',
    },
    ACTUAL_QUANTITY_INVALID: {
        code: 22,
        message: 'Số lượng thực tế lớn số lượng đặt hàng',
    },
    GOODS_RECEIPT_SERIAL_OR_BATCH_EXISTED: {
        code: 23,
        message: 'Số lô hoặc số serial đã tồn tại',
    },
    SERIAL_OR_BATCH_QUANTITY_INVALID: {
        code: 24,
        message:
            'Tổng số lượng sản phẩm của các serial/ số lô không khớp với số lượng thực tế.',
    },
    GOODS_RECEIPT_APPROVAL_NOT_FOUND: {
        code: 25,
        message: 'Không tìm thấy phiếu xác nhận nhập kho',
    },
    NOT_PERMISSION_APPROVAL: {
        code: 26,
        message: 'Người dùng không có quyền xác nhận',
    },
}

module.exports = errorCode
