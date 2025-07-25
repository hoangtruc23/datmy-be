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
    CUSTOMER_NOT_FOUND: {
        code: 12,
        message: 'Khách hàng không tồn tại!',
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
    APPROVAL_QUANTITY_NOT_YET: {
        code: 27,
        message: 'Chưa xác nhận hết số lượng sản phẩm',
    },
    PRODUCT_CODE_EXISTED: {
        code: 28,
        message: 'Mã sản phẩm đã tồn tại',
    },
    PRODUCT_CANNOT_CHANGE_MANAGEMENT_TYPE: {
        code: 29,
        message: 'Không thể thay đổi loại quản lý của sản phẩm đã có trong kho',
    },
    DO_NOT_UPDATE_STATUS_CANCEL: {
        code: 30,
        message: 'Không thể cập nhật phiếu với trạng thái đã hủy',
    },
    DO_NOT_CANCEL_GOODS_RECEIPT: {
        code: 31,
        message: 'Chỉ người tạo phiếu mới được phép hủy phiếu nhập kho',
    },
    GOODS_ISSUE_NOT_FOUND: {
        code: 32,
        message: 'Phiếu xuất kho không tồn tại',
    },
    GOODS_ISSUE_DETAIL_EXISTED: {
        code: 33,
        message: 'Sản phẩm được thêm đã tồn tại trong phiếu xuất kho',
    },
    GOODS_ISSUE_DETAIL_NOT_FOUND: {
        code: 35,
        message: 'Không tìm thấy sản phẩm này trong phiếu xuất',
    },
    GOODS_ISSUE_SERIAL_OR_BATCH_EXISTED: {
        code: 36,
        message: 'Số lô hoặc số serial đã tồn tại',
    },
    GOODS_ISSUE_APPROVAL_NOT_FOUND: {
        code: 37,
        message: 'Không tìm thấy phiếu xác nhận xuất kho',
    },
    DO_NOT_CANCEL_GOODS_ISSUE: {
        code: 38,
        message: 'Chỉ người tạo phiếu mới được phép hủy phiếu xuất kho',
    },
    ISSUED_QUANTITY_INVALID: {
        code: 39,
        message: 'Số lượng xuất lớn hơn số lượng tồn kho',
    },
    SERIAL_OR_BATCH_QUANTITY_INVALID: {
        code: 40,
        message: 'Số lượng sản phẩm trong lô lớn hơn số lượng tồn kho',
    },
    SERIAL_OR_BATCH_QUANTITY_TOTAL_INVALID: {
        code: 41,
        message:
            'Tổng số lượng sản phẩm của các lô không khớp với số lượng xuất',
    },
    GOODS_RECEIPT_APPROVAL_APPROVED: {
        code: 42,
        message: 'Phiếu nhập này đã hoàn thành',
    },
    GOODS_ISSUE_APPROVAL_APPROVED: {
        code: 43,
        message: 'Phiếu xuất này đã hoàn thành',
    },
    DO_NOT_UPDATE_GOODS_ISSUE_NOT_DRAFT: {
        code: 44,
        message: 'Không thể chỉnh sửa phiếu xuất kho không phải là nháp',
    },
    DO_NOT_UPDATE_PRODUCT_CREATED: {
        code: 45,
        message:
            'Không thể chỉnh sửa sản phẩm của phiếu nhập kho trong trạng thái: Hoàn thành, Từ chối, Hủy',
    },
    SERIAL_OR_BATCH_DUPLICATED: {
        code: 46,
        message: 'Số serial hoặc số lô bị trùng',
    },
    PRODUCT_STORAGE_NOT_FOUND: {
        code: 47,
        message: 'Không tìm thấy số serial / số lô',
    },
    GOODS_ADVANCE_NOT_FOUND: {
        code: 48,
        message: 'Phiếu tạm ứng không tồn tại',
    },
    GOODS_ADVANCE_DETAIL_EXISTED: {
        code: 49,
        message: 'Sản phẩm được thêm đã tồn tại trong phiếu tạm ứng',
    },
    GOODS_ADVANCE_DETAIL_NOT_FOUND: {
        code: 50,
        message: 'Không tìm thấy sản phẩm này trong phiếu tạm ứng',
    },
    GOODS_ADVANCE_SERIAL_OR_BATCH_EXISTED: {
        code: 51,
        message: 'Số lô hoặc số serial đã tồn tại',
    },
    GOODS_ADVANCE_APPROVAL_NOT_FOUND: {
        code: 52,
        message: 'Không tìm thấy phiếu xác nhận tạm ứng',
    },
    DO_NOT_CANCEL_GOODS_ADVANCE: {
        code: 53,
        message: 'Chỉ người tạo phiếu mới được phép hủy phiếu tạm ứng',
    },
    ADVANCE_QUANTITY_INVALID: {
        code: 54,
        message: 'Số lượng tạm ứng lớn hơn số lượng tồn kho',
    },
    GOODS_ADVANCE_APPROVAL_APPROVED: {
        code: 56,
        message: 'Phiếu tạm ứng này đã hoàn thành',
    },
    DO_NOT_UPDATE_GOODS_ADVANCE_CREATED: {
        code: 57,
        message: 'Không thể cập nhật phiếu tạm ứng đã',
    },
    TRACKING_CODE_NOT_FOUND: {
        code: 58,
        message: 'Không tìm thấy phiếu nhập kho cho số lô này',
    },
    FILE_NOT_FOUND: {
        code: 59,
        message: 'Không tìm thấy file',
    },
    FILE_DOWNLOAD_FAILED: {
        code: 60,
        message: 'Tải file không thành công',
    },
    INVOICE_CODE_EXISTED: {
        code: 61,
        message: 'Mã hóa đơn đã tồn tại',
    },
    INVOICE_NOT_FOUND: {
        code: 62,
        message: 'Hóa đơn không tồn tại',
    },
    INVALID_ID: {
        code: 63,
        message: 'ID không hợp lệ',
    },
    PAYMENT_HISTORY_NOT_FOUND: {
        code: 64,
        message: 'Lịch sử thanh toán không tồn tại',
    },
    PAYMENT_HISTORY_EXISTED: {
        code: 65,
        message: 'Lịch sử thanh toán đã tồn tại',
    },
    DISCOUNT_REQUEST_NOT_FOUND: {
        code: 66,
        message: 'Yêu cầu chiết khấu không tồn tại',
    },
    DISCOUNT_REQUEST_EXISTED: {
        code: 67,
        message: 'Yêu cầu chiết khấu đã tồn tại',
    },
    SERIAL_OR_BATCH_REQUIRED: {
        code: 68,
        message: 'Sản phẩm này yêu cầu phải có số serial hoặc số lô.',
    },
    SERIAL_NOT_ALLOWED_FOR_PRODUCT: {
        code: 69,
        message: 'Sản phẩm này không được quản lý theo serial/lô.',
    },
    SERIAL_QUANTITY_MUST_BE_ONE: {
        code: 70,
        message: 'Số lượng cho mỗi serial phải là 1.',
    },
    PAYMENT_NOT_FOUND: {
        code: 71,
        message: 'Thanh toán không tồn tại',
    },
    PAYMENT_ALREADY_EXISTS: {
        code: 72,
        message: 'Thanh toán đã tồn tại',
    },
    GOODS_ADVANCE_INVALID_STATE_FOR_RETURN: {
        code: 73,
        message: 'Không thể nhận lại hàng cho phiếu tạm ứng ở trạng thái này.',
    },
    GOODS_ADVANCE_RETURN_QUANTITY_INVALID: {
        code: 74,
        message: 'Số lượng trả lại vượt quá số lượng đã mượn.',
    },
    GOODS_ADVANCE_SERIAL_COUNT_MISMATCH: {
        code: 75,
        message: 'Tổng số serial không khớp với số lượng đã khai báo.',
    },
    DEBT_CONFIG_EXISTS: {
        code: 76,
        message: 'Cấu hình nợ đã tồn tại cho khách hàng này.',
    },
    DEBT_CONFIG_NOT_FOUND: {
        code: 77,
        message: 'Cấu hình nợ không tồn tại.',
    },
}

module.exports = errorCode
