const constant = {
    USER_ROOT: 'root',
    USER_BGD: 'bgd',
    REDIS_PREFIX_ACCESS_TOKEN: 'ACCESS_TOKEN',
    REDIS_PREFIX_PERMISSION: 'PERMISSION',
    ROLES: {
        BGD: '684927c871287f2ae7d8130a',
        admin: '684927c871287f2ae7d8130b',
        warehouseStaff: '684927c871287f2ae7d8130c',
        warehouseAccountant: '684927c871287f2ae7d8130e',
        debtAccountant: '684927c871287f2ae7d8130f',
        billAccountant: '684927c871287f2ae7d81310',
        sale: '684927c871287f2ae7d81311',
        warehouseManager: '68f6f623dc799da9305e4347',
        financeManager: '68f6f623dc799da9305e4348',
        technicalManager: '68f6f623dc799da9305e4349',
    },
    TECHNICIAN_PERMISSION_ID: {
        WORK_ORDER: '68d1166bba1c480c8180bf6b',
        WORK_ORDER_READ: '68d1166bba1c480c8180bf6c',
        WORK_ORDER_DETAIL: '6914e05ccf9e7d1d96f5a0f0',
        WORK_ORDER_DETAIL_READ: '6914e05ccf9e7d1d96f5a0f1',
        WORK_ORDER_DETAIL_UPDATE: '6914e05ccf9e7d1d96f5a0f2',
    },
    PRODUCT_MANAGEMENT_TYPE: {
        NONE: 'none',
        SERIAL: 'serial',
        BATCH: 'batch',
    },
    GOODS_ISSUE_STATUS: {
        NULL: '',
        DRAFT: 'draft',
        WAREHOUSE_STAFF_APPROVAL: 'warehouseStaffApproval',
        WAREHOUSE_ACCOUNTANT_APPROVAL: 'warehouseAccountantApproval',
        DEBT_ACCOUNTANT_APPROVAL: 'debtAccountantApproval',
        BILL_ACCOUNTANT_APPROVAL: 'billAccountApproval',
        APPROVED: 'approved',
        REJECT: 'reject',
        CANCEL: 'cancel',
    },
    GOODS_RECEIPT_STATUS: {
        NULL: '',
        WAREHOUSE_STAFF_APPROVAL: 'warehouseStaffApproval',
        APPROVED: 'approved',
        REJECT: 'reject',
        CANCEL: 'cancel',
    },
    GOODS_ADVANCE_STATUS: {
        NULL: '',
        WAREHOUSE_STAFF_APPROVAL: 'warehouseStaffApproval',
        APPROVED: 'approved',
        WAITING_FOR_EXTENSION: 'waitingForExtension',
        IN_DEBT: 'inDebt',
        RETURNED: 'returned',
        REJECT: 'reject',
        CANCEL: 'cancel',
    },
    GOODS_ADVANCE_PROCESS_TITLE: {
        CREATE: 'create',
        APPROVAL: 'approval',
        EXTEND: 'extend',
        RECEIVE_BACK: 'receiveBack',
        CANCEL: 'cancel',
    },
    APPROVAL_STATUS: {
        NULL: '',
        APPROVED: 'approved',
        REJECTED: 'rejected',
        CANCEL: 'cancel',
    },
    PAYMENT_STATUS: {
        PAID: 'paid',
        PARTIALLY_PAID: 'partiallyPaid',
    },
    REFUND_STATUS: {
        PAID: 'paid',
        UNPAID: 'unpaid',
    },
    PAYMENT_METHOD: {
        CASH: {
            value: 'cash',
            name: 'Tiền mặt',
        },
        BANK_TRANSFER: {
            value: 'bankTransfer',
            name: 'Chuyển khoản',
        },
        OTHER: {
            value: 'other',
            name: 'Khác',
        },
    },
    DEBT_REMINDER_STATUS: {
        NULL: '',
        SCHEDULED: 'scheduled',
        COMPLETED: 'completed',
    },
    DEBT_REMINDER_METHOD: {
        NULL: '',
        EMAIL: 'email',
        PHONE: 'phone',
        OFFLINE: 'offline',
    },
    INVOICE_STATUS: {
        NULL: '',
        PAID: 'paid',
        PARTIALLY_PAID: 'partiallyPaid',
        PENDING: 'pending',
        OVERDUE: 'overdue',
    },
    DEBT_STATUS: {
        NO_DEBT: 'noDebt',
        NORMAL: 'normal', // còn trong hạn nợ
        OVERDUE: 'overdue', //mới quá hạn
        BAD_DEBT: 'badDebt', // nợ lâu nợ xấu
    },
    DEBT_STATUS_PERIOD: {
        BAD_DEBT: 30, //
    },
    DEBT_REMINDER_PRIORITY: {
        LOW: 'low',
        MEDIUM: 'medium',
        HIGH: 'high',
        URGENT: 'urgent',
    },
    DEBT_RESULT: {
        NULL: '',
        PROMISE_PAID: 'promisePaid',
        PARTIALLY_PAID: 'partiallyPaid',
        NO_RESPONSE: 'noResponse',
        FULLY_PAID: 'fullyPaid',
    },
    CONDITION_PAYMENT: {
        NULL: '',
        TRANSFER: 'transfer',
        CASH: 'cash',
        DEBT: 'debt',
    },
    TECHNICIAN_STATUS: {
        FREE: {
            value: 'free',
            name: 'Rảnh',
        },
        WORKING: {
            value: 'working',
            name: 'Đang hoạt động',
        },
    },
    WORK_ORDER_TYPE: {
        NULL: {
            value: '',
            name: '',
        },
        REPAIR: {
            value: 'repair',
            name: 'Sửa chữa',
        },
        MAINTENANCE: {
            value: 'maintenance',
            name: 'Bảo trì',
        },
        INSTALLATION: {
            value: 'installation',
            name: 'Lắp đặt',
        },
        TEST_IO: {
            value: 'testIO',
            name: 'Test Xuất/Nhập',
        },
        DEMO: {
            value: 'demo',
            name: 'Demo',
        },
        SAMPLE_PRINTING: {
            value: 'samplePrinting',
            name: 'In mẫu',
        },
    },
    WORK_ORDER_DETAIL_TYPE: {
        NULL: {
            value: '',
            name: '',
        },
        D: {
            value: 'D',
            name: 'D',
        },
        G: {
            value: 'G',
            name: 'G',
        },
        V: {
            value: 'V',
            name: 'V',
        },
        M: {
            value: 'M',
            name: 'M',
        },
        A: {
            value: 'A',
            name: 'A',
        },
    },
    WORK_REQUEST_SOURCE: {
        CUSTOMER: {
            value: 'customer',
            name: 'Khách hàng',
        },
        WAREHOUSE: {
            value: 'warehouse',
            name: 'Kho',
        },
        DEMO: {
            value: 'demo',
            name: 'Demo',
        },
    },
    WORK_REQUEST_STATUS: {
        PENDING: {
            value: 'pending',
            name: 'Chờ xử lý',
        },
        IN_PROGRESS: {
            value: 'inProgress',
            name: 'Đang xử lý',
        },
        COMPLETED: {
            value: 'completed',
            name: 'Hoàn thành',
        },
        OVERDUE: {
            value: 'overdue',
            name: 'Quá hạn',
        },
    },
    WORK_REQUEST_PRIORITY: {
        HIGH: {
            value: 'high',
            name: 'Cao',
        },
        MEDIUM: {
            value: 'medium',
            name: 'Trung bình',
        },
        LOW: {
            value: 'low',
            name: 'Thấp',
        },
    },
    DEPARTMENT: {
        WAREHOUSE: 'warehouse',
        FINANCE: 'finance',
        TECHNICAL: 'technical',
    },
    MACHINE_PROPERTIES_TYPE: {
        NORMAL: 'normal',
        LINKED: 'linked',
        CUSTOM: 'custom',
    },
    CATEGORY_NAME: {
        COMPONENT_PRINT_HEAD: 'LINH KIỆN - HỆ THỐNG ĐẦU IN',
        COMPONENT_INK_SYSTEM: 'LINH KIỆN - HỆ THỐNG MỰC IN',
        COMPONENT_ELECTRICAL_BOARD: 'LINH KIỆN - HỆ THỐNG BO MẠCH ĐIỆN',
        ACCESSORY_SPARE_PARTS_MACHINE: 'PHỤ KIỆN & PHỤ TÙNG MÁY IN',
        MACHINE: 'MÁY IN PHUN BAO BÌ CÔNG NGHIỆP',
        MATERIAL_INK: 'NGUYÊN LIỆU - MỰC IN',
        MATERIAL_SOLVENT: 'NGUYÊN LIỆU - DUNG MÔI HỖN HỢP HỮU CƠ',
        MATERIAL_RIBBON: 'NGUYÊN LIỆU - RUY BĂNG',
    },
    INK_DROP_LEVEL_TYPE: {
        AUTOMATIC: 'automatic',
        MANUAL: 'manual',
        NULL: '',
    },
    PURPOSE_TEST: {
        HANDOVER: 'handover',
        RENTAL: 'rental',
        REPAIR: 'repair',
        DEMO: 'demo',
        LOAN: 'loan',
        RECEIPT: 'receipt',
    },
    PRINT_SPEED_LEVEL: {
        BASIC: 'basic',
        MEDIUM: 'medium',
        MAXIMUM: 'maximum',
    },
    PRODUCT_MOVEMENT: {
        STATIC: 'Static',
        MOF: 'Mark on the Fly',
    },
    ENCODER_SOURCE: {
        ENCODER_INPUT: 'Encoder Input',
        FIXED_SPEED: 'Fixed Speed',
    },
    REPAIR_D_SOFTWARE_TYPE: {
        RAINBOW: 'Rainbow',
        QUICKSTEP: 'Quickstep',
    },
    SYNC_SIGNAL: {
        INTERNAL: 'Internal',
        EXTERNAL_1: 'External 1',
        EXTERNAL_2: 'External 2',
        EXTERNAL_1_PHOTOCELL: 'External-1Photocell',
        EXTERNAL_2_PHOTOCELLS: 'External-2Photocells',
    },
    SYNC_MODE: {
        SINGLE: 'Single',
        BACKLASH: 'Backlash',
        BACKLASH_SUPPRESSED: 'Backlash suppressed',
        BACKLASH_FORWARD: 'Backlash forward',
    },
    PRINTHEAD_DIRECTION: {
        LEFT: 'left',
        RIGHT: 'right',
    },
    PRINT_MODE: {
        IM: 'static',
        CM: 'moving',
    },
    APPLICATOR_MODE: {
        STATIC: 'static',
        DYNAMIC: 'dynamic',
    },
    SAMPLE_PRINTING_METHOD_NAME: {
        CONVEYOR: {
            value: 'conveyor',
            name: 'Băng tải',
        },
        CUSTOMER_LINE: {
            value: 'customer line',
            name: 'Lắp đặt dây chuyền của khách hàng',
        },
        OTHER: {
            value: 'other',
            name: 'Khác',
        },
    },
    SAMPLE_PRINTING_INFORMATION_FROM: {
        TECHNICIAN: {
            value: 'technician',
            name: 'Kỹ thuật lấy về',
        },
        BUSINESS: {
            value: 'business',
            name: 'Kinh doanh lấy về',
        },
    },
    MACHINE_PROPERTIES_GROUP_NAME: {
        INFO: 'info',
        SPECS: 'specs',
    },
    PROPERTY_ID: {
        INK_TYPE: '69081ac30879097d22c84abe',
        PRINT_HEAD_QUANTITY: '691508159d647f9729da4a9c',
    },
    REPAIR_A_RESOLUTION_STATE: {
        REPLACE: {
            value: 'replace',
            name: 'Thay mới',
        },
        LOAN: {
            value: 'loan',
            name: 'Tạm mượn',
        },
    },
}

module.exports = constant
