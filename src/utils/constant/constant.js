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
        FREE: 'free',
        WORKING: 'working',
    },
    TECHNICIAN_SKILL: {
        REPAIR: 'repair',
        MAINTENANCE: 'maintenance',
        DEMO: 'demo',
        CONSULTING: 'consulting',
        SAMPLE_PRINTING: 'samplePrinting',
        TEST_IO: 'testIO',
        INSTALLATION: 'installation',
    },
    WORK_TYPE_1: {
        NULL: '',
        REPAIR: 'repair',
        MAINTENANCE: 'maintenance',
        INSTALLATION: 'installation',
        TEST_IO: 'testIO',
        DEMO: 'demo',
        SAMPLE_PRINTING: 'samplePrinting',
    },
    WORK_TYPE_2: {
        NULL: '',
        D: 'D',
        G: 'G',
        V: 'V',
        M: 'M',
        A: 'A',
    },
    WORK_REQUEST_SOURCE: {
        CUSTOMER: 'customer',
        WAREHOUSE: 'warehouse',
        DEMO: 'demo',
    },
    WORK_REQUEST_STATUS: {
        PENDING: 'pending',
        IN_PROGRESS: 'inProgress',
        COMPLETED: 'completed',
        OVERDUE: 'overdue',
    },
    WORK_REQUEST_PRIORITY: {
        HIGH: 'high',
        MEDIUM: 'medium',
        LOW: 'low',
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
}

module.exports = constant
