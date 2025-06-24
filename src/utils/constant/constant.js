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
        REJECT: 'reject',
        CANCEL: 'cancel',
    },
    APPROVAL_STATUS: {
        NULL: '',
        APPROVED: 'approved',
        REJECTED: 'rejected',
        CANCEL: 'cancel',
    },
}

module.exports = constant
